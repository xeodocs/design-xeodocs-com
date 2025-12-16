"use client";

import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
// Custom CSS wrapper to handle dark mode potentially or just container
import "./openapi.css";

interface OpenApiRendererProps {
    spec: string; // YAML or JSON string
}

export function OpenApiRenderer({ spec }: OpenApiRendererProps) {
    // Parsing the YAML/JSON string might be needed if SwaggerUI expects object or url.
    // SwaggerUI `spec` prop accepts object. If string is YAML, it usually needs parsing if passed as object, 
    // but SwaggerUI can handle string spec? Docs say `spec` is object.
    // Actually SwaggerUI-React `spec` prop: "A JSON object describing the OpenAPI Specification."
    // If we have a string (YAML), we might need `js-yaml` or rely on SwaggerUI parsing it if we convert.
    // But wait, SwaggerUI also has `url`. We can use `url` if we serve the file.
    // But we want to load it from content directory.
    // Let's check if we can pass string to `spec` or if we need to parse. 
    // SwaggerUI often handles it. Let's try passing parsed object. 
    // Or easier: fetch the URL directly? 
    // The implementations above `fetchContent` returns string.

    // Let's use `url` if possible, but since we modify content locally and might want to just pass the string...
    // It's safer to pass parsed object or let Swagger handle it.
    // Swagger-ui-react docs: "spec: PropTypes.object". So it expects an object. 
    // So I should stick to fetching it as text and parsing it?
    // Or just give it the "url" prop pointing to "/content/openapi.yaml"?
    // If I use `url`, SwaggerUI fetches it. This is easier and supports YAML automatically.
    // HOWEVER, if I ever need to preprocess (e.g. resolve refs), `spec` is better.
    // But given the requirements, `url` pointing to the public file is cleanest if the file exists.
    // The app logic: "fetch content from ... directory".

    // If we assume the file name is in config, we can construct the URL.
    // But our `page.tsx` might fetch the text.
    // If I use the `url` prop, I don't need to fetch text in `page.tsx`.
    // Let's update `OpenApiRenderer` to accept `url` or `spec`.

    // Actually, for "one directory" requirement, if the file is there, `url` is /content/filename.

    // But wait, user said "visualize ... description".
    // Let's pass the fetched content might be better if we want to support editing later (live preview).
    // But for now, read-only.

    // I will use `url` prop for simplicity if I can pass the filename.
    // But the generic architecture I imagined was "Load content -> Pass to Renderer".
    // Markdown needs content. OpenAPI can use URL. AsyncAPI needs schema (string or object).

    // Let's stick to "Pass content" pattern for consistency?
    // If so I need a YAML parser. `js-yaml`.
    // Or I can just install `js-yaml`.

    // Alternative: SwaggerUI can also take `url`. 
    // And AsyncAPI component takes `schema` (string or object).

    // Let's use `js-yaml` to be safe and consistent with "fetching content manually".
    // Wait, I didn't install `js-yaml`.
    // Checking `swagger-ui-react` types... it wants object.

    // I'll install `yaml` package or `js-yaml`.
    // Or... just use the `url` prop since I know where the file is.
    // `page.tsx` knows the filename.

    // BUT, to keep the "Renderer" abstraction clean, maybe I should pass the URL?
    // But MarkdownRenderer needs headers? No.

    // Let's try passing `spec` as object. I'll need `js-yaml`.
    // No, actually, I'll use the URL method for OpenAPI because SwaggerUI handles resolution best that way.
    // For AsyncAPI?

    // Let's install `js-yaml` to be robust. 
    // Or just use `url` for Swagger and `schema` string for AsyncAPI (it handles string?).

    // AsyncAPI react component: `schema` prop: "The AsyncAPI specification content. It can be a string, or a JavaScript object."

    // So simple plan:
    // OpenApiRenderer: takes `url`.
    // AsyncApiRenderer: takes `content` (string).
    // MarkdownRenderer: takes `content` (string).

    // Wait, if I use `url` for OpenAPI, I bypass the `fetchHelper`. That's fine.

    return (
        <div className="swagger-container bg-white rounded-lg p-2 overflow-x-auto">
            <SwaggerUI url={spec} />
            {/* Note: In dark mode, SwaggerUI default styles are light. We might need `invert` filter or custom CSS. */}
        </div>
    );
}
