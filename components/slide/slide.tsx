//@ts-nocheck
import theme from "!!raw-loader!./theme.css";
import Marpit from '@marp-team/marpit'
interface SlideProps {
    input: string;
    setInput: (value: string) => void;
}

export function Slide({ input, setInput }: SlideProps) {
    const marpit = new (Marpit as any)({
        markdown: {
            // html: true, // Enable HTML tags
        },
    });
    marpit.themeSet.default = marpit.themeSet.add(theme)
    const { html, css, comments } = marpit.render(input)
    return (
        <div className="w-[960px] h-[720px] overflow-scroll">
            <style>
                {css}
                {`
                    .marpit {
                        display: flex;
                        flex-direction: column;
                        gap: 32px;
                    }
                `}
            </style>
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