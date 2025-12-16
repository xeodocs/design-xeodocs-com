"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

mermaid.initialize({
    startOnLoad: false,
});

export function Mermaid({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [svg, setSvg] = useState("");

    useEffect(() => {
        // Reset mermaid for theme change
        mermaid.initialize({
            startOnLoad: false,
            theme: theme === "dark" ? "dark" : "default",
        });
    }, [theme]);

    useEffect(() => {
        if (chart && ref.current) {
            const render = async () => {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);
                    setSvg(svg);
                } catch (error) {
                    console.error("Mermaid rendering error:", error);
                    setSvg(`<pre class="text-red-500">${error}</pre>`);
                }
            };
            render();
        }
    }, [chart, theme]);

    return (
        <div
            ref={ref}
            className="mermaid flex justify-center p-4 bg-white dark:bg-neutral-800 rounded-md overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
