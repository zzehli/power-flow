"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Slide } from "@/components/slide/slide";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction, useRef } from 'react';
import { LoadingButton } from '@/components/ui/loading-button';
interface UploadDialogProps {
  chatInput: string;
  setChatInput: Dispatch<SetStateAction<string>>
  setIsError: Dispatch<SetStateAction<boolean>>
  setInput: Dispatch<SetStateAction<string>>
}
export function UploadDialog(props: UploadDialogProps) {
  const [isRequestLoading, setRequestIsLoading] = useState(false);
  const [inputError, setInputError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false)

  const fileInputRef = useRef(null);
  const MAX_QUESTION_LENGTH = 300

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRequestIsLoading(true);
    setOpen(false)

    if (!props.chatInput.trim()) {
      setInputError("Please enter your question.")
      return
    }

    if (props.chatInput.length > MAX_QUESTION_LENGTH) {
      setInputError(`Question must be less than ${MAX_QUESTION_LENGTH} characters.`)
      return
    }
    const formData = new FormData();
    formData.append('input', props.chatInput);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: formData, // Send the chatInput to the API
      }); // Submit the input to postChat

      const data = await response.json();
      props.setInput(data.message); // Set the response message to the input state
    } catch (error) {
      props.setIsError(true);
    } finally {
      setRequestIsLoading(false);
      setInputError("");
      props.setChatInput('');
      setFile(null);
      if (fileInputRef.current) {
        (fileInputRef.current as HTMLInputElement).value = '';
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <LoadingButton variant="default" disabled={isRequestLoading} loading={isRequestLoading}>Start Here</LoadingButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter request</DialogTitle>
          <DialogDescription>
            Write your ideas here. Optionally upload a related text file that you want to be included in the presentation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="input" className="text-right">
                Your Request
              </Label>
              <span className={`text-xs ${props.chatInput.length > MAX_QUESTION_LENGTH ? "text-red-400" : "text-gray-400"}`}>
                {props.chatInput.length}/{MAX_QUESTION_LENGTH}
              </span>
            </div>
            <Textarea
              id="input"
              placeholder="Type your ides here"
              className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary focus:border-primary"
              value={props.chatInput}
              onChange={(e) => { props.setIsError(false); props.setChatInput(e.target.value) }}
            />
            {inputError &&
              <p className="text-red-500 text-sm">{inputError}</p>
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-right">File Upload</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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