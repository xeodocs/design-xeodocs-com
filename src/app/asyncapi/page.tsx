"use client";

import dynamic from "next/dynamic";
import { useConfig } from "@/lib/config-context";
import { fetchContent } from "@/lib/api";
import { useEffect, useState } from "react";

const AsyncApiRenderer = dynamic(
    () => import("@/components/renderers/AsyncApiRenderer").then((mod) => mod.AsyncApiRenderer),
    { ssr: false }
);

export default function AsyncApiPage() {
    const { config } = useConfig();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (config?.files.asyncapi) {
            fetchContent(config.files.asyncapi)
                .then(setContent)
                .catch((err) => console.error("Failed asyncapi content", err))
                .finally(() => setLoading(false));
        }
    }, [config]);

    if (loading) return <div>Loading content...</div>;

    return (
        <div className="h-full overflow-y-auto">
            <AsyncApiRenderer schema={content} />
        </div>
    );
}
