"use client";

import dynamic from "next/dynamic";
import { useConfig } from "@/lib/config-context";
import { fetchContent } from "@/lib/api";
import { useEffect, useState } from "react";

const MarkdownRenderer = dynamic(
    () => import("@/components/renderers/MarkdownRenderer").then((mod) => mod.MarkdownRenderer),
    { ssr: false }
);

export default function SystemPage() {
    const { config } = useConfig();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    // Initial load and handle selection change
    useEffect(() => {
        const files = config?.files.systemDesign;
        if (Array.isArray(files) && files.length > 0) {
            // Select first file by default if none selected
            const targetPath = selectedPath || files[0].path;

            // Only update selectedPath if it was null (initial load)
            if (!selectedPath) {
                setSelectedPath(targetPath);
            }

            setLoading(true);
            fetchContent(targetPath)
                .then(setContent)
                .catch((err) => console.error("Failed system design content", err))
                .finally(() => setLoading(false));
        }
    }, [config, selectedPath]);

    if (!config?.files.systemDesign) return null;

    const files = config.files.systemDesign;

    if (!Array.isArray(files)) return <div>Configuration error: systemDesign should be a list of files.</div>;

    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

    useEffect(() => {
        if (!content) {
            setToc([]);
            return;
        }

        const lines = content.split("\n");
        const headings: { id: string; text: string; level: number }[] = [];

        // Simple slugify function
        const slugify = (text: string) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')     // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-');  // Replace multiple - with single -
        };

        lines.forEach((line) => {
            const match = line.match(/^(#{1,3})\s+(.*)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = slugify(text);
                headings.push({ id, text, level });
            }
        });
        setToc(headings);
    }, [content]);

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Left Sidebar */}
            <aside className="w-64 border-r dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 overflow-y-auto flex-shrink-0">
                <nav className="p-4 space-y-1">
                    {files.map((file) => (
                        <button
                            key={file.path}
                            onClick={() => setSelectedPath(file.path)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedPath === file.path
                                ? "bg-neutral-200 dark:bg-neutral-800 font-medium text-foreground"
                                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground"
                                }`}
                        >
                            {file.title}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content Area + Right Sidebar Container */}
            <div className="flex-1 flex overflow-hidden">
                {/* Scrollable Main Content */}
                <div className="flex-1 overflow-y-auto min-w-0">
                    <div className="max-w-5xl mx-auto w-full">
                        {loading ? (
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                Loading...
                            </div>
                        ) : (
                            <MarkdownRenderer content={content} />
                        )}
                    </div>
                </div>

                {/* Right Sidebar - TOC */}
                <aside className="w-64 border-l dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 overflow-y-auto hidden xl:block flex-shrink-0 p-4">
                    <h3 className="font-semibold text-sm mb-3 text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                        On this page
                    </h3>
                    <nav className="space-y-1">
                        {toc.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`block text-sm py-1 transition-colors hover:text-foreground ${item.level === 1
                                    ? "font-medium text-neutral-900 dark:text-neutral-100"
                                    : item.level === 2
                                        ? "pl-4 text-neutral-600 dark:text-neutral-400"
                                        : "pl-8 text-neutral-500 dark:text-neutral-500"
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                {item.text}
                            </a>
                        ))}
                    </nav>
                </aside>
            </div>
        </div>
    );
}
