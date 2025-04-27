// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import theme from "!!raw-loader!./theme.css";
import Marpit from '@marp-team/marpit'
interface SlideProps {
    input: string;
    setInput: (value: string) => void;
}
console.log("theme", theme)
export function Slide({ input, setInput }: SlideProps) {
    const marpit = new (Marpit as any)();
    //     const theme = `
    // /* @theme example */

    // section {
    // background-color: #369;
    // color: #fff;
    // font-size: 30px;
    // padding: 40px;
    // }

    // h1,
    // h2 {
    // text-align: center;
    // margin: 0;
    // }

    // h1 {
    // color: #8cf;
    // }
    // `

    // 3. Render markdown
    const markdown = `

# Hello, Marpit!

Marpit is the skinny framework for creating slide deck from Markdown.

---

# Ready to convert into PDF!

You can convert into PDF slide deck through Chrome.

`
    marpit.themeSet.default = marpit.themeSet.add(theme)
    const { html, css } = marpit.render(markdown)
    return (
        <div>
            <style>{css}</style>
            {html ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: html,
                    }}
                />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}