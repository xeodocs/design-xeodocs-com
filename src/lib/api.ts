import { XeoConfig } from "./types";

const CONTENT_BASE = "/content";

export async function fetchConfig(): Promise<XeoConfig> {
    const res = await fetch(`${CONTENT_BASE}/xeocontext.config.json`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to load configuration");
    }
    return res.json();
}

export async function fetchContent(filename: string): Promise<string> {
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
    const res = await fetch(`${CONTENT_BASE}/${cleanFilename}`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Failed to load content: ${filename}`);
    }
    return res.text();
}
