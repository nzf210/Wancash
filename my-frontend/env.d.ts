interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_API_URL?: string
  readonly VITE_WHITEPAPER_URL?: string
  readonly VITE_USDT_TOKEN_BSC: string
  readonly VITE_USDT_TOKEN_BSC_TEST: string
  readonly VITE_WCH_TOKEN_ROOTSTOCK?: string
  readonly VITE_WCH_TOKEN_ROOTSTOCK_TEST?: string
  readonly VITE_SENTRY_DSN?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: <T = Record<string, unknown>>(
    globPattern: string,
    options?: {
      import?: string
      eager?: boolean
      query?: string | Record<string, string | number | boolean>
    },
  ) => Record<string, T>
}
