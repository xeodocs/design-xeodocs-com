"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to determine active state
    // Default to 'system' if on root
    const isActive = (path: string) => {
        if (pathname === "/" && path === "/system") return true;
        return pathname?.startsWith(path);
    };

    return (
        <header className="border-b dark:border-neutral-800 bg-background sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <h1 className="text-xl font-bold">{title}</h1>
                    <nav className="flex space-x-1">
                        <TabLink
                            label="System Design"
                            href="/system"
                            isActive={isActive("/system")}
                        />
                        <TabLink
                            label="OpenAPI"
                            href="/openapi"
                            isActive={isActive("/openapi")}
                        />
                        <TabLink
                            label="AsyncAPI"
                            href="/asyncapi"
                            isActive={isActive("/asyncapi")}
                        />
                    </nav>
                </div>

                <div className="flex items-center space-x-2">
                    {mounted && (
                        <div className="flex items-center border rounded-md p-1 dark:border-neutral-700">
                            <button
                                onClick={() => setTheme("system")}
                                className={clsx(
                                    "p-1.5 rounded-md transition-colors",
                                    theme === "system"
                                        ? "bg-neutral-200 dark:bg-neutral-700 text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                title="System"
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTheme("light")}
                                className={clsx(
                                    "p-1.5 rounded-md transition-colors",
                                    theme === "light"
                                        ? "bg-neutral-200 dark:bg-neutral-700 text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                title="Light"
                            >
                                <Sun className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={clsx(
                                    "p-1.5 rounded-md transition-colors",
                                    theme === "dark"
                                        ? "bg-neutral-200 dark:bg-neutral-700 text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                title="Dark"
                            >
                                <Moon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function TabLink({
    label,
    isActive,
    href,
}: {
    label: string;
    isActive: boolean | undefined;
    href: string;
}) {
    return (
        <Link
            href={href}
            className={clsx(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                    ? "bg-neutral-100 dark:bg-neutral-800 text-foreground"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            )}
        >
            {label}
        </Link>
    );
}
