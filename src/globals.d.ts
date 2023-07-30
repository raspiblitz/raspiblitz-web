declare global {
  // for more detailed type-info see:
  // https://github.com/getAlby/lightning-browser-extension/blob/master/src/extension/providers/alby/index.ts#L3
  interface Window {
    alby?: {
      enable: () => Promise<void>;
      addAccount: (params: {
        name: string;
        connector: string;
        config: Record<string, unknown>;
      }) => Promise<{ success: boolean }>;
    };
  }
}

export {};
