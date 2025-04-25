"use client"
import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Reveal from 'reveal.js';
import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/league.css';
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown';
import { createPortal } from 'react-dom';
export default function WorkspacePage() {
  const [input, setInput] = useState<string>("");
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
        plugins: [RevealNotes, RevealZoom, RevealMarkdown]
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
        </div>
      </main>
    </div>
  )
}