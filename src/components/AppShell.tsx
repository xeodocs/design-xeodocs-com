"use client";

import { useConfig } from "@/lib/config-context";
import { Header } from "@/components/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { config, loading, error } = useConfig();

    if (loading && !config) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            </div>
        );
    }

    if (error && !config) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 bg-background">
                {error}
            </div>
        );
    }

    // Fallback title if config not loaded yet but we proceed? 
    // Should ideally not prevent default render if partial config?
    // But let's stick to safe "loading" state.

    if (!config) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header title={config.title} />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
