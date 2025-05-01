"use client"
import { useState } from "react";
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
        console.log('here ')
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
        setOpen(false)
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