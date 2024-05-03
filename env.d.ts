declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      readonly DEV_MODE: 'true' | 'false'
    }
  }
}

export {};
