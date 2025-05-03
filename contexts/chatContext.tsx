"use client"
import React, { useState, createContext, useContext } from "react";

interface ChatContextProps {
    isError: boolean;
    setIsError: React.Dispatch<React.SetStateAction<boolean>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    isRequestLoading: boolean;
    setRequestIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChatContext = createContext<ChatContextProps | null>(null)


export function ChatContextProvider({ children }: { children: React.ReactNode }) {
    const [isError, setIsError] = useState(false);
    const [input, setInput] = useState("");
    const [isRequestLoading, setRequestIsLoading] = useState(false);
    return (
        <ChatContext.Provider value={{ isError, setIsError, input, setInput, isRequestLoading, setRequestIsLoading }
        }>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatContextProvider");
    }
    return context;
}
