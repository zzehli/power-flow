import { AIProjectsClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

const connectionString = process.env.AZURE_AI_PROJECTS_CONNECTION_STRING ?? "<connectionString>";
const client = AIProjectsClient.fromConnectionString(
    connectionString,
    new DefaultAzureCredential(),
);