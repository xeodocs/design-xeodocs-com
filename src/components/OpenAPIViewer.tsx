"use client";

import { useEffect, useRef, useState } from "react";
import "swagger-ui-dist/swagger-ui.css";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface OpenAPIViewerProps {
    spec: Record<string, any>;
}

export function OpenAPIViewer({ spec }: OpenAPIViewerProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === "dark";

    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        const initSwagger = async () => {
            /**
            * CRITICAL: We use 'swagger-ui-dist' with manual initialization instead of 'swagger-ui-react'.
            * 
            * REASON: 
            * 'swagger-ui-react' (versions > 5.0) causes severe "refract is not a function" errors 
            * in Next.js/Turbopack environments due to issues with the internal 'swagger-client' and 'apidom' dependencies.
            * 
            * This manual approach isolates the Swagger bundle from the React build process, ensuring stability.
            * DO NOT SWITCH BACK TO 'swagger-ui-react' UNLESS THIS COMPATIBILITY ISSUE IS CONFIRMED FIXED.
            */

            // Dynamically import the bundle to avoid SSR issues
            // @ts-ignore - The declaration file might be missing for the bundle specifically
            const SwaggerUIBundle = (await import("swagger-ui-dist/swagger-ui-bundle")).default;

            SwaggerUIBundle({
                spec: spec,
                domNode: containerRef.current,
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "BaseLayout",
                docExpansion: "list",
                syntaxHighlight: {
                    theme: "monokai" // Optional: helps with code blocks
                }
            });
        };

        initSwagger();
    }, [mounted, spec]);

    return (
        <div className="swagger-wrapper bg-white dark:bg-[#020817] backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-border/50 dark:border-border/10">
            {isDark && (
                <link rel="stylesheet" href="/assets/openapi-dark.css" />
            )}
            <style jsx global>{`
        .swagger-ui .wrapper {
          padding: 0;
          max-width: none;
        }
        .swagger-ui .topbar {
            display: none;
        }
        .swagger-ui .info {
            padding: 2rem;
            margin: 0;
        }
        .swagger-ui .scheme-container {
            padding: 1rem 2rem;
            background: transparent;
            box-shadow: none;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .swagger-ui .opblock-tag {
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            margin: 0;
        }
        .swagger-ui .opblock {
            margin: 0 2rem 1rem;
            border-radius: 8px;
            box-shadow: none;
            border: 1px solid rgba(0,0,0,0.1);
        }
            `}</style>
            {!mounted ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div ref={containerRef} />
            )}
        </div>
    );
}
