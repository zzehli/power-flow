"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Slide } from "@/components/slide/slide";
import { Button } from "@/components/ui/button"

import { Dispatch, SetStateAction, useRef } from 'react';
import { UploadDialog } from "@/components/upload-dialog";

export default function WorkspacePage() {
  const greeting = `### Ready to Impress?\n\nNow you can turn simple markdown text into beautiful, interactive presentations. Let’s get started! :rocket:`

  const [input, setInput] = useState<string>(greeting);
  const [chatInput, setChatInput] = useState<string>("");
  const [slideContent, setSlideContent] = useState({ html: '', css: '' });
  const [isError, setIsError] = useState(false);
  const handleOpenNewWindow = () => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const doc = newWindow.document;

      // Create and populate the HTML structure
      const html = doc.createElement("html");
      const head = doc.createElement("head");
      const body = doc.createElement("body");
      const style = doc.createElement("style");
      style.textContent = slideContent.css;
      head.appendChild(style);

      // Add content
      body.innerHTML = slideContent.html;

      html.appendChild(head);
      html.appendChild(body);

      // Replace the document's content
      doc.replaceChild(html, doc.documentElement);
      newWindow.print()
    }
  };

  return (
    <div className="flex min-h-screen max-h-screen flex-col min-w-full">
      <main className="mx-auto py-10">
        <div className="py-5 space-y-2">
          <UploadDialog chatInput={chatInput} setChatInput={setChatInput} setIsError={setIsError} setInput={setInput} />
          {isError &&
            <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
          }
        </div>

        <div className="flex gap-7 max-h-[860px]">

          <div className="min-w-xs w-[400px] md:w-96 max-h-[860px] flex flex-col">
            <div className="grid gap-2 mb-5 w-80">


            </div>
            <div className="text-sm font-semibold text-gray-400 mb-2">Edit the slides with Markdown:</div>
            <div className="border border-b-1 border-stone-600 bg-transparent min-w-xs flex-grow">
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="markdown"
                theme="vs-dark"
                value={input}
                onChange={(value) => setInput(value || "")}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  renderLineHighlight: "all",
                  renderLineHighlightOnlyWhenFocus: true
                }}
              />
            </div>

          </div>
          <div className="flex flex-col gap-2 justify-center">
            <div className="text-right">
              <Button onClick={handleOpenNewWindow} variant={"secondary"}>Print Slides</Button>
              <div className="text-sm font-semibold text-gray-400 mb-2">For best typesetting results, use chromium browsers.</div>

            </div>
            <div className="border border-b-1 border-stone-600 bg-transparent p-2">
              <Slide input={input} setInput={setInput} content={slideContent} setContent={setSlideContent} />
            </div>
          </div>
        </div>



      </main>
    </div>
  )
}