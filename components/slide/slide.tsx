"use client"

import theme from "!!raw-loader!./theme.css";
import { Marp as Marpit } from '@marp-team/marp-core'
import { useEffect, useState } from "react";
interface SlideProps {
    input: string;
    content: { html: string; css: string };
    setContent: (value: { html: string; css: string }) => void;
}

export function Slide({ input, content, setContent }: SlideProps) {
    const [isError, setIsError] = useState(false);

    const marpitHeader = `---\npaginate: true\n---\n\n`
    useEffect(() => {

        const marpit = new (Marpit as any)({
            markdown: {
                linkify: true, // Autoconvert URL-like text to links
            },
        });
        marpit.themeSet.default = marpit.themeSet.add(theme);
        try {
            const { html, css, comments } = marpit.render(marpitHeader + input);
            setContent({ html, css });
        } catch (error) {
            console.error("Error rendering markdown:", error);
            setContent({ html: '', css: '' });
            setIsError(true);
        }
    }, [input]);

    return (
        <div className="w-[960px] h-[545px] overflow-y-scroll my-auto">
            <style>
                {content.css}
                {`
                    .marpit {
                        display: flex;
                        flex-direction: column;
                        gap: 32px;
                    }
                `}
            </style>
            {content.html ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: content.html,
                    }}
                />
            ) : isError ? (
                <div>Error rendering content. Please try again.</div>
            ) :
                (
                    <div>Loading...</div>
                )}
        </div>
    )
}