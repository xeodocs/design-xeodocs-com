export interface XeoConfig {
    title: string;
    logo?: string;
    files: {
        systemDesign?: { title: string; path: string }[];
        openapi?: string;
        asyncapi?: string;
    };
}

