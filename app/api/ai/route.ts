import OpenAI from "openai";

export async function POST(req: Request) {
    const { input } = await req.json();
    const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: process.env.GITHUB_TOKEN
    });

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "" },
            { role: "user", content: "What is the capital of France?" }
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
    });

    console.log(response.choices[0].message.content);
    return new Response(
        JSON.stringify({ message: response.choices[0].message.content }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}