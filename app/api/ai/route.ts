import OpenAI from "openai";
import { AIProjectsClient, AgentOutput, ToolUtility, isOutputOfType, RunStreamEvent, MessageStreamEvent, ErrorEvent, DoneEvent } from "@azure/ai-projects";
import * as fs from 'fs';
import { DefaultAzureCredential } from "@azure/identity";
import type {
    MessageContentOutput,
    MessageImageFileContentOutput,
    MessageTextContentOutput,
} from "@azure/ai-projects";
const systemPrompt = "You are a revealjs/slidev/marp markdown slide generator. \
Always respond to the user with a markdown. If a file is provided, respond to the user input that include information in the file, but no need to cite your sources\
If the user input has nothing to do with the file, ignore the file content and generate based on the user input\
Generate beautiful markdowns that uses ### to start a title and split pages with ---. \
The last page does not need ---. Restrict single page content to 60 words or less. \
Generate 3 pages at a time. The first page is a title page that only has a # and a ##. \
You can use emoji to make the presentation interesting if the user question is casual. \
Don't put emoji in the each page's title and the first page. Use Emoji 16.0 spec like :smile:. \
You should use math functions if the content needs formula. \
Use $...$ to render math as inline, and $$...$$ to render as block. Don't use numbered list. Don't wrap the whole output around ```"

export async function POST(req: Request) {
    const { input } = await req.json();

    let output = ""

    try {
        const connectionString = process.env.AZURE_AI_PROJECTS_CONNECTION_STRING ?? "<connectionString>";
        const client = AIProjectsClient.fromConnectionString(
            connectionString,
            new DefaultAzureCredential(),
        );

        const localFileStream = fs.createReadStream('./Reverse Index Tree.md');

        const file = await client.agents.uploadFile(localFileStream, "assistants", {
            fileName: "user_file.txt",
        });
        console.log(`Uploaded file, ID: ${file.id}`);
        const vectorStore = await client.agents.createVectorStore({
            fileIds: [file.id],
            name: "ms_hack_vector_store",
        });
        console.log(`Created vector store, ID: ${vectorStore.id}`);
        console.log(`vector store file count `, vectorStore.fileCounts)
        const fileSearchTool = ToolUtility.createFileSearchTool([vectorStore.id]);
        console.log("fileSearchTool ", fileSearchTool.definition)
        const promptConfig = {
            name: "SDK Test Agent - Retrieval",
            prompt: input,
            instructions: systemPrompt,
            tools: [fileSearchTool.definition],
            toolResources: fileSearchTool.resources,
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
            try {
                await client.agents.deleteVectorStore(vectorStore.id);
                await client.agents.deleteFile(file.id);
                await client.agents.deleteAgent(agent.id);
            } catch (cleanupError) {
                console.error("Error during cleanup:", cleanupError);
            }
        }, 0);
    } catch (e) {
        console.error(e)
    }
    return new Response(
        JSON.stringify({ message: output }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );

}