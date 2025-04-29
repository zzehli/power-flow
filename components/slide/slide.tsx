"use client"

import theme from "!!raw-loader!./theme.css";
import Marpit from '@marp-team/marpit'
import { useEffect, useState } from "react";
interface SlideProps {
    input: string;
    setInput: (value: string) => void;
}

export function Slide({ input, setInput }: SlideProps) {
    const [content, setContent] = useState({ html: '', css: '' });

    // const marpit = new (Marpit as any)({
    //     markdown: {
    //         // html: true, // Enable HTML tags
    //     },
    // });
    // marpit.themeSet.default = marpit.themeSet.add(theme)
    // const { html, css, comments } = marpit.render(input)

    useEffect(() => {

        const marpit = new (Marpit as any)({
            markdown: {
                // html: true, // Enable HTML tags
            },
        });
        marpit.themeSet.default = marpit.themeSet.add(theme);
        const { html, css, comments } = marpit.render(input);
        setContent({ html, css });
    }, [input]);

    return (
        <div className="w-[960px] h-[720px] overflow-scroll">
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
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}