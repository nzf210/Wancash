interface ImportMeta {
  readonly glob: <T = Record<string, unknown>>(
    globPattern: string,
    options?: {
      import?: string;
      eager?: boolean;
      query?: string | Record<string, string | number | boolean>;
    }
  ) => Record<string, T>;
}
