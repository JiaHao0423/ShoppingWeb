/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 後端 API 基底路徑；Docker 建置時通常設為 `/api`（由 Nginx 反代） */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}