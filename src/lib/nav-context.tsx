"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavContextType {
    lastSystemPath: string;
    setLastSystemPath: (path: string) => void;
    isInitialized: boolean;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
    const [lastSystemPath, setLastSystemPath] = useState("/system-design");
    const [isInitialized, setIsInitialized] = useState(false);
    const pathname = usePathname();

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("xeocontext-last-path");
            if (stored) {
                setLastSystemPath(stored);
            }
            setIsInitialized(true);
        }
    }, []);

    // Sync with pathname and save to localStorage
    useEffect(() => {
        if (pathname === "/" || pathname.startsWith("/system-design")) {
            const newPath = pathname === "/" ? "/system-design" : pathname;
            setLastSystemPath(newPath);
            if (typeof window !== "undefined") {
                localStorage.setItem("xeocontext-last-path", newPath);
            }
        }
    }, [pathname]);

    return (
        <NavContext.Provider value={{ lastSystemPath, setLastSystemPath, isInitialized }}>
            {children}
        </NavContext.Provider>
    );
}

export function useNav() {
    const context = useContext(NavContext);
    if (context === undefined) {
        throw new Error("useNav must be used within a NavProvider");
    }
    return context;
}
