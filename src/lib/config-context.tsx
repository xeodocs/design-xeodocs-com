"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { XeoConfig } from "@/lib/types";
import { fetchConfig } from "@/lib/api";

interface ConfigContextType {
    config: XeoConfig | null;
    loading: boolean;
    error: string | null;
}

const ConfigContext = createContext<ConfigContextType>({
    config: null,
    loading: true,
    error: null,
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<XeoConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig()
            .then((cfg) => {
                setConfig(cfg);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load configuration.");
                setLoading(false);
            });
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading, error }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    return useContext(ConfigContext);
}
