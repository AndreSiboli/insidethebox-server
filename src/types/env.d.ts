declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            DB_PORT: string;
            SECRET_SESSION: string;
            SECRET_TOKEN: string;
            SECRET_REFRESH_TOKEN: string;
        }
    }
}

export {};
