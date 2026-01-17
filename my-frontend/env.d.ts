interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_API_URL?: string;
  readonly VITE_WHITEPAPER_URL?: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: <T = Record<string, unknown>>(
    globPattern: string,
    options?: {
      import?: string;
      eager?: boolean;
      query?: string | Record<string, string | number | boolean>;
    }
  ) => Record<string, T>;
}
