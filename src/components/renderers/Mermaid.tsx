import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

mermaid.initialize({
    startOnLoad: false,
});

export function Mermaid({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [svg, setSvg] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Cleanup scrolling when modal is open and handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen]);

    return (
        <>
            <div className="relative group">
                <div
                    ref={ref}
                    className="mermaid flex justify-center p-4 bg-white dark:bg-neutral-800 rounded-md overflow-x-auto border border-neutral-200 dark:border-neutral-700"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-2 right-2 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    title="Expand"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-900 w-full h-full rounded-lg flex flex-col overflow-hidden relative border dark:border-neutral-800">
                        {/* Header/Controls */}
                        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">

                            {/* Close Button at the very end */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            centerOnInit
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-md p-2 rounded-lg border dark:border-neutral-700 shadow-lg">
                                        <button
                                            onClick={() => zoomIn()}
                                            className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors"
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => zoomOut()}
                                            className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => resetTransform()}
                                            className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors"
                                            title="Reset"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-black/50 overflow-hidden cursor-move">
                                        <TransformComponent
                                            wrapperClass="!w-full !h-full"
                                            contentClass="!w-full !h-full flex items-center justify-center"
                                        >
                                            <div
                                                className="min-w-min min-h-min p-10"
                                                dangerouslySetInnerHTML={{ __html: svg }}
                                            />
                                        </TransformComponent>
                                    </div>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                </div>
            )}
        </>
    );
}
