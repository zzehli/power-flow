"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Slide } from "@/components/slide/slide";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { POST } from "@/app/api/ai/route";
import Form from "next/form";

export default function WorkspacePage() {
  const [input, setInput] = useState<string>("");
  const [chatInput, setChatInput] = useState<string>("");
  const handleSubmit = async () => {
    console.log("chatInput", chatInput);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: chatInput }), // Send the chatInput to the API
      }); // Submit the input to postChat

      const data = await response.json();
      setInput(data.message); // Set the response message to the input state
      console.log("Response from postChat:", data);
    } catch (error) {
      console.error("Error submitting to postChat:", error);
    }
  };
  return (
    <div className="flex min-h-screen flex-col min-w-full">
      <main className="mx-auto py-10">
        <div className="grid max-w-sm w-full gap-2 mx-auto mb-5">
          <Textarea
            placeholder="Type your ides here."
            className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary focus:border-primary"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <Button onClick={handleSubmit}>Start generate</Button>
        </div>
        <div className="border border-b-1 border-stone-600 bg-transparent mb-7">
          <Slide input={input} setInput={setInput} />
        </div>
        <div className="border border-b-1 border-stone-600 bg-transparent">
          <Editor
            height="500px"
            width="960px"
            defaultLanguage="markdown"
            theme="vs-dark"
            value={input}
            onChange={(value) => setInput(value || "")}
          />
        </div>


      </main>
    </div>
  )
}