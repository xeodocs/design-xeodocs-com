"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Library } from "lucide-react";
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

    const isActive = (path: string) => {
        if (pathname === "/" && path === "/system") return true;
        return pathname?.startsWith(path);
    };

    return (
        <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {title}
                        </h1>
                    </Link>

                    <nav className="flex items-center space-x-1 bg-muted/50 p-1 rounded-full border border-border/50">
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

                <div className="flex items-center space-x-4">
                    {mounted && (
                        <div className="flex items-center bg-muted/50 border border-border/50 rounded-full p-1">
                            {['system', 'light', 'dark'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={clsx(
                                        "p-1.5 rounded-full transition-all duration-200",
                                        theme === t
                                            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                    )}
                                    title={t.charAt(0).toUpperCase() + t.slice(1)}
                                >
                                    {t === 'system' && <Monitor className="w-4 h-4" />}
                                    {t === 'light' && <Sun className="w-4 h-4" />}
                                    {t === 'dark' && <Moon className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center space-x-2 border-l border-border/50 pl-4">
                        <a
                            href="https://github.com/xeost/xeocontext"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                            title="GitHub Repository"
                        >
                            <GithubIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://xeocontext.com/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                            title="Documentation"
                        >
                            <Library className="w-5 h-5" />
                        </a>
                    </div>
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
                "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                isActive
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
        >
            {label}
        </Link>
    );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
        >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    )
}
