import OpenAI from "openai";

export async function POST(req: Request) {
    const { input } = await req.json();
    const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: process.env.GITHUB_TOKEN
    });

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a revealjs/slidev/marp markdown slide generator. Generate beautiful markdowns that uses ### to start a title and split pages with ---. The last page does not need ---. Restrict single page content to 60 words or less. Generate 7 pages at a time. The first page is a title page that only has a # and a ##. You can use emoji to make the presentation interesting if the user question is casual. Don't put emoji in the each page's title and the first page. Use Emoji 16.0 spec like :smile:. You should use math functions if the content needs formula. Use $...$ to render math as inline, and $$...$$ to render as block. Don't use numbered list. Don't wrap the whole output around ```" },
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