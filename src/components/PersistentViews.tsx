"use client";

import { useConfig } from "@/lib/config-context";
import { SystemDesignViewer } from "@/components/SystemDesignViewer";
import { OpenAPIViewer } from "@/components/OpenAPIViewer";
import { AsyncAPIViewer } from "@/components/AsyncAPIViewer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PersistentViews() {
    const { config } = useConfig();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    const isSystemDesign = pathname === "/" || pathname.startsWith("/system-design");
    const isOpenAPI = pathname.startsWith("/openapi");
    const isAsyncAPI = pathname.startsWith("/asyncapi");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!config?.projectName) return;
        const suffix = ` - ${config.projectName}`;

        if (isOpenAPI) {
            document.title = `OpenAPI${suffix}`;
        } else if (isAsyncAPI) {
            document.title = `AsyncAPI${suffix}`;
        }
    }, [isOpenAPI, isAsyncAPI, config?.projectName]);

    // Construct full URLs for specs. 
    // config.openapi is relative like "/global/gateway/openapi.yaml"
    // We need to pass "/content/global/gateway/openapi.yaml" if usage is via client fetch.
    // The route /content/[...slug] serves files.
    // So if config.openapi is "./foo.yaml", we assume it is relative to content root?
    // Memory[content.md] says: "The content is located at the repository root."
    // And "config.openapi item in the configuration" specifies the file.
    // Usually configuration paths are relative to content root or absolute starting with /.

    const getSpecUrl = (path?: string) => {
        if (!path) return undefined;
        // path usually starts with / (e.g. /global/gateway/openapi.yaml)
        // Our content API is at /content/[...slug]
        // If path starts with /, remove it.
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/content/${cleanPath}`;
    }

    if (!mounted) return null;

    return (
        <div className="flex-1 relative overflow-hidden flex flex-col h-full">
            {/* System Design View */}
            <div
                className="w-full h-full flex flex-col"
                style={{ display: isSystemDesign ? 'flex' : 'none' }}
            >
                <SystemDesignViewer isActive={isSystemDesign} />
            </div>

            {/* OpenAPI View */}
            {config?.openapi && (
                <div
                    className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                    style={{ display: isOpenAPI ? 'block' : 'none' }}
                >
                    <div className="pt-8 px-4 max-w-7xl mx-auto w-full pb-20">
                        <div className="flex flex-col space-y-2 mb-8">
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                                OpenAPI Specification
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Explore and test the RESTful API endpoints defined in the system architecture.
                            </p>
                        </div>
                        <div className="w-full">
                            <OpenAPIViewer url={getSpecUrl(config.openapi)} />
                        </div>
                    </div>
                </div>
            )}

            {/* AsyncAPI View */}
            {config?.asyncapi && (
                <div
                    className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                    style={{ display: isAsyncAPI ? 'block' : 'none' }}
                >
                    <div className="pt-8 px-4 max-w-7xl mx-auto w-full pb-20">
                        <div className="flex flex-col space-y-2 mb-8">
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                                AsyncAPI Specification
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Explore the event-driven architecture, channels, and messages defined in the system.
                            </p>
                        </div>

                        <div className="w-full">
                            <AsyncAPIViewer url={getSpecUrl(config.asyncapi)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
