"use client"
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from 'react';
import { useChatContext } from "@/contexts/chatContext";
import { useRouter } from 'next/navigation'
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from "@/hooks/use-toast"


const ALLOWED_FILE_TYPES = ["text/plain", "text/markdown"]

export function ChatBox() {
    const [chatInput, setChatInput] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [inputError, setInputError] = useState("");
    const router = useRouter()
    const { dismiss } = useToast()

    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_QUESTION_LENGTH = 300

    const { setIsError, setInput, setRequestIsLoading, isRequestLoading } = useChatContext();

    // File change handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setIsError(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!chatInput.trim()) {
            setInputError("Please enter your question.")
            return
        }

        if (chatInput.length > MAX_QUESTION_LENGTH) {
            setInputError(`Question must be less than ${MAX_QUESTION_LENGTH} characters.`)
            return
        }

        const formData = new FormData();
        formData.append('input', chatInput);
        router.push('/workspace');

        setTimeout(async () => {
            if (file) {

                const fileExtension = file.name.split(".").pop()?.toLowerCase()
                if (!ALLOWED_FILE_TYPES.includes(file.type) && !(fileExtension === "md" || fileExtension === "txt")) {
                    setInputError("Please upload only .txt or .md files")
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                    return
                }
                formData.append('file', file);
            }
            setRequestIsLoading(true);
            try {
                const response = await fetch("/api/ai", {
                    method: "POST",
                    body: formData, // Send the chatInput to the API
                }); // Submit the input to postChat

                const data = await response.json();

                // Remove all 【】 and any content inside them
                const cleanedMessage = data.message.replace(/【[^】]*】/g, '');
                setInput(cleanedMessage); // Set the cleaned response
            } catch (error) {
                setIsError(true);
                console.error("Error:", error);
            } finally {
                setRequestIsLoading(false)
                console.log("dismissing")
                dismiss()
                setInputError("");
                setChatInput('');
                setFile(null);
                if (fileInputRef.current) {
                    (fileInputRef.current as HTMLInputElement).value = '';
                }

            }
        }, 0)
    };

    return (
        <div className="max-w-md mx-auto">
            {/* <p>
                Write your ideas here. Optionally upload a related text file and describe how it should be included in the presentation.
            </p> */}
            <div className="grid gap-4 py-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="input" className="text-right text-muted-foreground">
                                Your Request
                            </Label>
                            <span className={`text-xs ${chatInput.length > MAX_QUESTION_LENGTH ? "text-red-400" : "text-gray-400"}`}>
                                {chatInput.length}/{MAX_QUESTION_LENGTH}
                            </span>
                        </div>
                        <Textarea
                            id="input"
                            placeholder="Type your ides here"
                            className="resize-none bg-gray-900 border-gray-600 placeholder-gray-400 focus:ring-primary focus:border-primary"
                            value={chatInput}
                            onChange={(e) => { setIsError(false); setChatInput(e.target.value) }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-right text-muted-foreground">Optional File Upload (.txt or .md)</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="col-span-3 bg-gray-900 border-gray-600 placeholder-gray-400 text-muted-foreground" />
                    </div>
                    {inputError &&
                        <p className="text-red-500 text-sm">Input Error: {inputError}</p>
                    }
                    <LoadingButton type="submit" loading={isRequestLoading}>Generate</LoadingButton>
                </form>
            </div>


        </div>
    )
}