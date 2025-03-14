declare global {
  type Nullable<T> = T | null;
  type FetchCTX = FetchContext<unknown, ResponseType> & {
    response: FetchResponse<ResponseType>;
  };
  interface Window {
    Telegram?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      WebApp: Record<string, any>;
    };
    __FIREBASE_CONFIG__: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    }
  }
}

export { };


declare module 'nuxt/schema' {
  interface AppConfigInput {
    theme?: {
      bgPrimary?: string;
      bgGray?: string;
      textPrimaryColor?: string;
    }
  }
}