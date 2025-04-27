"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Slide } from "@/components/slide/slide";
export default function WorkspacePage() {
  const [input, setInput] = useState<string>("");

  return (
    <div className="flex min-h-screen flex-col min-w-full">
      <main className="mx-auto py-10">
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