"use client";

import dynamic from "next/dynamic";
import { useConfig } from "@/lib/config-context";

const OpenApiRenderer = dynamic(
    () => import("@/components/renderers/OpenApiRenderer").then((mod) => mod.OpenApiRenderer),
    { ssr: false }
);

export default function OpenApiPage() {
    const { config } = useConfig();

    if (!config?.files.openapi) return <div>No OpenAPI file configured.</div>;

    return (
        <div className="h-full overflow-y-auto">
            <OpenApiRenderer spec={`/content/${config.files.openapi}`} />
        </div>
    );
}
