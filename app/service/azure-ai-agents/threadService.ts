// adopted from https://github.com/Azure-Samples/azure-ai-agents-javascript/blob/main/src/services/threadService.ts
// https://github.com/Azure/azure-sdk-for-js/blob/a14470df846bb93891195dd653994c2189878f75/sdk/ai/ai-projects/samples-dev/agents/fileSearch.ts
import type {
    AgentOutput,
    FunctionToolDefinitionOutput,
    MessageDeltaChunk,
    MessageDeltaTextContent,
    MessageTextContentOutput,
    SubmitToolOutputsActionOutput,
    ThreadRunOutput,
    ToolOutput,
} from "@azure/ai-projects";
import {
    AIProjectsClient,
    AgentThreadOutput,
    DoneEvent,
    ErrorEvent,
    MessageStreamEvent,
    RunStreamEvent,
    isOutputOfType
} from "@azure/ai-projects";
import type { PromptConfig } from '@/app/type/types'

export async function addMessageToThread(
    client: AIProjectsClient,
    threadId: string,
    message: string
) {
    await client.agents.createMessage(threadId, {
        role: "user",
        content: message,
    });
}

export async function printThreadMessages(
    selectedPromptConfig: PromptConfig,
    client: AIProjectsClient,
    threadId: string
) {
    const messages = await client.agents.listMessages(threadId);
    console.log("\nMessages:\n----------------------------------------------");

    // Messages iterate from oldest to newest - messages[0] is the most recent
    const messagesArray = messages.data;
    for (let i = messagesArray.length - 1; i >= 0; i--) {
        const m = messagesArray[i];
        const content = m.content[0];

        if (!content) {
            // Skip if no content
            continue;
        }

        console.log(`Type: ${m.content[0].type}`);
        if (isOutputOfType<MessageTextContentOutput>(m.content[0], "text")) {
            const textContent = m.content[0] as MessageTextContentOutput;
            const role = m.role === "user" ? "User" : "Agent";
            console.log(`${role}: ${textContent.text.value}`);
        }
    }
}

export async function getRunStats(
    runId: string,
    client: AIProjectsClient,
    thread: AgentThreadOutput
) {
    if (runId) {
        const completedRun = await client.agents.getRun(thread.id, runId);
        console.log("\nToken usage:", completedRun.usage);
    }
}

export async function runAgent(
    client: AIProjectsClient,
    thread: AgentThreadOutput,
    agent: AgentOutput,
    promptConfig: PromptConfig
): Promise<string> {
    const run = client.agents.createRun(thread.id, agent.id, { parallelToolCalls: false });
    let streamEventMessages = await run.stream();
    let runId = "";

    for await (const eventMessage of streamEventMessages) {
        console.log(eventMessage.event)

        switch (eventMessage.event) {
            case RunStreamEvent.ThreadRunCreated:
                runId = (eventMessage.data as ThreadRunOutput).id;
                break;

            case MessageStreamEvent.ThreadMessageDelta:
                {
                    const messageDelta = eventMessage.data as MessageDeltaChunk;
                    messageDelta.delta.content.forEach(async (contentPart) => {
                        if (contentPart.type === "text") {
                            const textContent = contentPart as MessageDeltaTextContent;
                            const textValue = textContent.text?.value || "";
                            process.stdout.write(textValue);
                        }
                        if (contentPart.type === "image_file") {
                            process.stdout.write(`\nReceived image file\n`);
                        }
                    });
                }
                break;

            case RunStreamEvent.ThreadRunRequiresAction:
                let runOutput = eventMessage.data as ThreadRunOutput;
                if (runOutput.requiredAction) {
                    const runStream = await processRequiredAction(
                        client,
                        thread,
                        runOutput,
                        promptConfig
                    );
                    if (runStream) {
                        streamEventMessages = runStream;
                    }
                }
                break;

            case RunStreamEvent.ThreadRunCompleted:
                console.log("\nThread run completed.");
                break;

            case ErrorEvent.Error:
                console.error("Error:", eventMessage.data);
                break;

            case DoneEvent.Done:
                // Nothing to do here
                break;
        }
    }

    return runId;
}

async function processRequiredAction(
    client: AIProjectsClient,
    thread: AgentThreadOutput,
    run: ThreadRunOutput,
    promptConfig: PromptConfig
) {
    if (
        run.requiredAction &&
        isOutputOfType<SubmitToolOutputsActionOutput>(
            run.requiredAction,
            "submit_tool_outputs"
        )
    ) {
        const submitToolOutputsActionOutput = run.requiredAction;
        const toolCalls = submitToolOutputsActionOutput.submitToolOutputs.toolCalls;
        const toolResponses: ToolOutput[] = [];
        for (const toolCall of toolCalls) {
            if (isOutputOfType<FunctionToolDefinitionOutput>(toolCall, "function")) {
                const toolResponse = promptConfig.executor?.invokeTool(
                    toolCall
                ) as ToolOutput;
                console.log(`💡 Function tool ${toolCall.id} - ${toolResponse.output}`);
                if (toolResponse) {
                    toolResponses.push(toolResponse);
                }
            }
        }
        if (toolResponses.length > 0) {
            console.log(`Submitting tool outputs to run ID ${run.id}`);
            return client.agents
                .submitToolOutputsToRun(thread.id, run.id, toolResponses)
                .stream();
        }
    }
}