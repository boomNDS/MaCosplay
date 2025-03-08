/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PB_URL: string
    readonly VITE_REPLICATE_API_TOKEN: string
    readonly VITE_AUTH_ADMIN_NAME: string
    readonly VITE_AUTH_ADMIN_PASS: string
    readonly VITE_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 