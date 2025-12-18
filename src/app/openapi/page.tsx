import { OpenAPIViewer } from '@/components/OpenAPIViewer';
import { notFound } from 'next/navigation';
import { getServerConfig, getContentPath } from '@/lib/server-utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import path from 'path';

export const metadata = {
    title: 'OpenAPI Specification - XeoContext',
    description: 'Interactive API documentation',
};

export default async function OpenAPIPage() {
    const config = await getServerConfig();

    if (!config || !config.openapi) {
        notFound();
    }

    const contentPath = getContentPath();
    // config.openapi typically starts with / like /global/gateway/openapi.yaml
    const relativePath = config.openapi.startsWith('/') ? config.openapi.slice(1) : config.openapi;
    const openApiFilePath = path.join(contentPath, relativePath);

    let bundledSpec = null;
    let errorMsg = null;

    try {
        // Dereference the API definition (resolves ALL $refs to inline objects)
        // This is crucial to avoid client-side resolution errors with OpenAPI 3.1
        bundledSpec = await SwaggerParser.dereference(openApiFilePath);
    } catch (err: any) {
        console.error("Error bundling OpenAPI spec:", err);
        errorMsg = err.message || "Unknown error bundling API specification";
    }

    if (errorMsg) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
                <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
                    <h3 className="font-semibold mb-2">Failed to load OpenAPI Definition</h3>
                    <p>{errorMsg}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
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
                    {/* 
                        Ensure the spec is passed as a plain object to avoid issues with 
                        SwaggerParser's internal types or prototypes that might confuse SwaggerUI.
                    */}
                    <OpenAPIViewer spec={JSON.parse(JSON.stringify(bundledSpec))} />
                </div>
            </div>
        </div>
    );
}
