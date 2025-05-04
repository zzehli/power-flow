"use client"
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Slide } from "@/components/slide/slide";
import { Button } from "@/components/ui/button"
import { useChatContext } from "@/contexts/chatContext";
import { useToast } from "@/hooks/use-toast";
export default function WorkspacePage() {
  // const greeting = `### Ready to Impress?\n\nNow you can turn simple markdown text into beautiful, interactive presentations. Let’s get started! :rocket:`

  const [slideContent, setSlideContent] = useState({ html: '', css: '' });
  const { toast } = useToast();
  const { isError, input, setInput, isRequestLoading } = useChatContext();
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

  useEffect(() => {
    if (isRequestLoading) {
      toast({
        title: "Generating slides...",
        description: "Please wait while we generate the slides.",
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen max-h-screen flex-col min-w-full">
      <main className="mx-auto py-10">
        <div className="py-5 space-y-2">
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
              <Button onClick={handleOpenNewWindow} variant={"outline"}>Print Slides</Button>
              <div className="text-sm font-semibold text-gray-400 mb-2">For best typesetting results, use chromium browsers.</div>

            </div>
            <div className="border border-b-1 border-stone-600 bg-transparent p-2">
              <Slide input={input} content={slideContent} setContent={setSlideContent} />
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}