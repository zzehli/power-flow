import { useState, useRef, useEffect } from "react";

import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/league.css';
import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown';

interface RevealProps {
    input: string;
    setInput: (value: string) => void;
}

export function Slide({ input, setInput }: RevealProps) {
    const [results, setResults] = useState<string>("");
    const revealRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance

    useEffect(() => {
        // Make sure we're in the browser environment
        if (typeof window === 'undefined' || !revealRef.current) return;

        // Only initialize once
        if (!deckRef.current) {
            deckRef.current = new Reveal(revealRef.current, {
                transition: "slide",
                embedded: true,
                width: 400,
                height: 400,
                plugins: [RevealNotes, RevealMarkdown]
            });

            deckRef.current.initialize().then(() => {
                console.log("Reveal.js initialized successfully");
            }).catch(error => {
                console.error("Failed to initialize Reveal.js:", error);
            });
        }

        // Cleanup function
        return () => {
            if (deckRef.current) {
                deckRef.current.destroy();
                deckRef.current = null;
            }
        };
    }, []);
    return (
        <div ref={revealRef} className="reveal">
            <div className="slides">
                <section>
                    <h2>Slide 1</h2>
                    <p>This is the first slide</p>
                </section>
                <section>
                    <h2>Slide 2</h2>
                    <p>This is the second slide</p>
                </section>
            </div>
        </div>
    )
}