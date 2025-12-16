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

    useEffect(() => {
        if (config?.files.systemDesign) {
            fetchContent(config.files.systemDesign)
                .then(setContent)
                .catch((err) => console.error("Failed system design content", err))
                .finally(() => setLoading(false));
        }
    }, [config]);

    if (loading) return <div>Loading content...</div>;

    return <MarkdownRenderer content={content} />;
}
