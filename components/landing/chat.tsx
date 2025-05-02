"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction, useRef } from 'react';
import { LoadingButton } from '@/components/ui/loading-button';
import { useRouter } from 'next/navigation'
interface ChatBoxProps {
    // chatInput: string;
    // setChatInput: Dispatch<SetStateAction<string>>
    setIsError: Dispatch<SetStateAction<boolean>>
    setInput: Dispatch<SetStateAction<string>>
}
const ALLOWED_FILE_TYPES = ["text/plain", "text/markdown"]


export function ChatBox(props: ChatBoxProps) {
    const [chatInput, setChatInput] = useState<string>("");
    const [isRequestLoading, setRequestIsLoading] = useState(false);
    const [inputError, setInputError] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_QUESTION_LENGTH = 300

    // File change handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        props.setIsError(false);
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
        window.location.href = '/workspace';
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
            props.setInput(data.message); // Set the response message to the input state
        } catch (error) {
            props.setIsError(true);
            console.error("Error:", error);
        } finally {
            setRequestIsLoading(false);
            setInputError("");
            setChatInput('');
            setFile(null);
            if (fileInputRef.current) {
                (fileInputRef.current as HTMLInputElement).value = '';
            }
        }
    };

    return (
        <div className="max-w-md mx-auto">
            {/* <p>
                Write your ideas here. Optionally upload a related text file and describe how it should be included in the presentation.
            </p> */}
            <div className="grid gap-4 py-4">
                <form onSubmit={handleSubmit} className="space-y-2">
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
                            onChange={(e) => { props.setIsError(false); setChatInput(e.target.value) }}
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
                    <Button type="submit" className="mt-3">Generate</Button>
                </form>
            </div>


        </div>
    )
}