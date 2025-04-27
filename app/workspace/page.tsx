"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Slide } from "@/components/slide/slide";
export default function WorkspacePage() {
  const [input, setInput] = useState<string>("");

  return (
    <div className="flex min-h-screen flex-col min-w-full">
      <main className="flex flex-row container mx-auto py-10 gap-5">
        <div className="rounded-t-2xl border border-b-1 border-stone-600 bg-transparent">
          <Editor
            height="80vh"
            width="40vw"
            defaultLanguage="markdown"
            theme="vs-dark"
            value={input}
            onChange={(value) => setInput(value || "")}
          />
        </div>

        <div className="rounded-t-2xl border border-b-1 border-stone-600 bg-transparent w-1/2">
          <Slide input={input} setInput={setInput} />
        </div>
      </main>
    </div>
  )
}