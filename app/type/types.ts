import type { ToolDefinition } from '@azure/ai-projects';
import type { FileSearchToolDefinition } from "@azure/ai-projects";

export interface PromptConfig {
    prompt: string;
    instructions?: string;
    emoji?: string;
    tool?: FileSearchToolDefinition;
    filePath?: string;
    fileId?: string;
    aiSearch?: boolean;
    executor?: any;
    tools?: ToolDefinition[];
    toolResources?: any;
}