import OpenAI from "openai";
import { AIProjectsClient, AgentOutput, ToolUtility, isOutputOfType, RunStreamEvent, MessageStreamEvent, ErrorEvent, DoneEvent } from "@azure/ai-projects";
import * as fs from 'fs';
import { DefaultAzureCredential } from "@azure/identity";
import { addMessageToThread, getRunStats, printThreadMessages, runAgent } from '@/app/service/azure-ai-agents/threadService';
import type { PromptConfig } from '@/app/type/types'
import type {
    MessageContentOutput,
    MessageImageFileContentOutput,
    MessageTextContentOutput,
} from "@azure/ai-projects";
const systemPrompt = "You are a revealjs/slidev/marp markdown slide generator. Generate beautiful markdowns that uses ### to start a title and split pages with ---. The last page does not need ---. Restrict single page content to 60 words or less. Generate 3 pages at a time. The first page is a title page that only has a # and a ##. You can use emoji to make the presentation interesting if the user question is casual. Don't put emoji in the each page's title and the first page. Use Emoji 16.0 spec like :smile:. You should use math functions if the content needs formula. Use $...$ to render math as inline, and $$...$$ to render as block. Don't use numbered list. Don't wrap the whole output around ```"

export async function POST(req: Request) {
    const { input } = await req.json();
    const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: process.env.GITHUB_TOKEN
    });


    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input }
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
    });

    // console.log(response.choices[0].message.content);
    return new Response(
        JSON.stringify({ message: response.choices[0].message.content }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}

export async function GET() {
    try {
        const connectionString = process.env.AZURE_AI_PROJECTS_CONNECTION_STRING ?? "<connectionString>";
        const client = AIProjectsClient.fromConnectionString(
            connectionString,
            new DefaultAzureCredential(),
        );

        const localFileStream = fs.createReadStream('./Reverse Index Tree.md');

        const file = await client.agents.uploadFile(localFileStream, "assistants", {
            fileName: "sample_file_for_upload.txt",
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
        const input = "what is the document about"
        const promptConfig = {
            name: "SDK Test Agent - Retrieval",
            prompt: input,
            instructions: systemPrompt,
            tools: [fileSearchTool.definition],
            toolResources: fileSearchTool.resources,
        }
        console.log("promptConfig ", promptConfig)

        const agent = await client.agents.createAgent("gpt-4o", promptConfig);
        console.log("agent ", agent)

        //-------another method
        // Create thread
        const thread = await client.agents.createThread();
        console.log(`Created thread, thread ID: ${thread.id}`);

        // Create message
        const message = await client.agents.createMessage(thread.id, {
            role: "user",
            content: input,
        });
        console.log(`Created message, message ID: ${message.id}`);

        // Create run
        const run = await client.agents.createRun(thread.id, agent.id);

        // Print the messages from the agent
        const messages = await client.agents.listMessages(thread.id);

        // Messages iterate from oldest to newest
        // messages[0] is the most recent
        for (let i = messages.data.length - 1; i >= 0; i--) {
            const m = messages.data[i];
            if (isOutputOfType<MessageTextContentOutput>(m.content[0], "text")) {
                const textContent = m.content[0];
                console.log(`${textContent.text.value}`);
                console.log(`---------------------------------`);
            }
        }
        //---------------------

        // const thread = await client.agents.createThread();
        // await addMessageToThread(client, thread.id, input);

        // const runId = await runAgent(client, thread, agent, promptConfig);
        // await printThreadMessages(promptConfig, client, thread.id);
        // await getRunStats(runId, client, thread);

        // await dispose(promptConfig, client, agent);
        await client.agents.deleteVectorStore(vectorStore.id);
        console.log(`Deleted vector store, vector store ID: ${vectorStore.id}`);
        await client.agents.deleteFile(file.id);
        console.log(`Deleted file, file ID: ${file.id}`);
        // client.agents.deleteAgent(agent.id);
        // console.log(`Deleted agent, agent ID: ${agent.id}`);
    } catch (e) {
        console.log(e)
    }
    return new Response(null, { status: 200 })

}