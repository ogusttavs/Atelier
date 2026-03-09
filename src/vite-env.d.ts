/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KIWIFY_CHECKOUT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
