import { AIProjectsClient, ToolUtility, isOutputOfType } from "@azure/ai-projects";
import type { PromptConfig } from "@/app/type/types"
import { DefaultAzureCredential } from "@azure/identity";
import type {
    MessageTextContentOutput, OpenAIFileOutput, VectorStoreOutput
} from "@azure/ai-projects";
import { Readable } from "stream";

const systemPrompt = "You are a revealjs/slidev/marp markdown slide generator. \
Always respond to the user with a markdown. If a file is provided, respond to the user input that include information in the file, but no need to cite your sources\
If the user input has nothing to do with the file, ignore the file content and generate based on the user input\
Generate beautiful markdowns that uses ### to start a title and split pages with ---. \
Restrict single page content to 60 words or less. \
Generate 7 pages at a time. The first page is a title page that only has a # and a ##. \
You can use emoji to make the presentation interesting if the user question is casual. \
Don't put emoji in the each page's title and the first page. Use Emoji 16.0 spec like :smile:. \
You should use math functions if the content needs formula. \
Use $...$ to render math as inline, and $$...$$ to render as block. Don't use numbered list. Don't end the last page with ---. Don't wrap the whole output around ```"

// const app = express();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

export async function POST(req: Request) {
    const formData = await req.formData();
    const input = formData.get("input") as string;

    if (input.length > 300) {
        return new Response(
            JSON.stringify({ error: "Input exceeds the 200-character limit." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
    let output = ""
    let azureFile: OpenAIFileOutput | null
    let vectorStore: VectorStoreOutput | null
    const file = formData.get("file");
    let localFileStream
    if (file instanceof File) {
        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();
        const isTypeValid = ['txt', 'md'].includes(fileExtension!);
        if (!isTypeValid) {
            return new Response(
                JSON.stringify({ error: "File type unacceptable. Please only upload txt or md files." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        if (file.size <= maxSizeInBytes) {
            const arrayBuffer = await file.arrayBuffer();
            localFileStream = Readable.from(Buffer.from(arrayBuffer));
        } else {
            return new Response(
                JSON.stringify({ error: "File upload exceeds 3mb." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
    }


    try {
        const connectionString = process.env.AZURE_AI_PROJECTS_CONNECTION_STRING ?? "<connectionString>";
        const client = AIProjectsClient.fromConnectionString(
            connectionString,
            new DefaultAzureCredential(),
        );

        let promptConfig: PromptConfig = {
            name: "Markdown Generation Agent",
            prompt: input,
            instructions: systemPrompt,
        }
        if (localFileStream) {
            azureFile = await client.agents.uploadFile(localFileStream, "assistants", {
                fileName: "user_file.txt",
            });

            vectorStore = await client.agents.createVectorStore({
                fileIds: [azureFile.id],
                name: "ms_hack_vector_store",
            });

            const fileSearchTool = ToolUtility.createFileSearchTool([vectorStore.id]);
            console.log("fileSearchTool ", fileSearchTool.definition)
            promptConfig.tools = [fileSearchTool.definition]
            promptConfig.toolResources = fileSearchTool.resources
        }

        console.log("promptConfig ", promptConfig)

        const agent = await client.agents.createAgent("gpt-4o", promptConfig);

        // Create thread
        const thread = await client.agents.createThread()

        // Create message
        const message = await client.agents.createMessage(thread.id, {
            role: "user",
            content: input,
        });
        console.log(`Created message, message ID: ${message.id}`);

        // Create run
        let run = await client.agents.createRun(thread.id, agent.id)
        // Poll the run as long as run status is queued or in progress
        while (
            run.status === "queued" ||
            run.status === "in_progress" ||
            run.status === "requires_action"
        ) {
            // Wait for a second
            await new Promise((resolve) => setTimeout(resolve, 1000));
            run = await client.agents.getRun(thread.id, run.id);
        }
        // Print the messages from the agent
        const messages = await client.agents.listMessages(thread.id);
        while (messages.hasMore) {
            const nextMessages = await client.agents.listMessages(thread.id, {
                after: messages.lastId,
            });
            messages.data = messages.data.concat(nextMessages.data);
        }

        for (let i = messages.data.length - 2; i >= 0; i--) {
            const m = messages.data[i];
            if (isOutputOfType<MessageTextContentOutput>(m.content[0], "text")) {
                const textContent = m.content[0];

                output = output.concat(textContent.text.value)
            }
        }
        //---------------------


        setTimeout(async () => {
            if (azureFile) {
                await client.agents.deleteFile(azureFile.id);
            }
            if (vectorStore) {
                await client.agents.deleteVectorStore(vectorStore.id);
            }
            await client.agents.deleteAgent(agent.id);
        }, 0);
    } catch (e) {
        console.error(e)
    }
    return new Response(
        JSON.stringify({ message: output }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );

}