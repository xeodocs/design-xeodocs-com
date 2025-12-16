import { XeoConfig } from "./types";

const CONTENT_BASE = "/content";

export async function fetchConfig(): Promise<XeoConfig> {
    const res = await fetch(`${CONTENT_BASE}/xeocontext.config.json`);
    if (!res.ok) {
        throw new Error("Failed to load configuration");
    }
    return res.json();
}

export async function fetchContent(filename: string): Promise<string> {
    const res = await fetch(`${CONTENT_BASE}/${filename}`);
    if (!res.ok) {
        throw new Error(`Failed to load content: ${filename}`);
    }
    return res.text();
}
