declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      readonly RPC_WSS: string;
      readonly RPC_HTTPS: string;

      readonly SUPABASE_PROJECT_ID: string;
      readonly SUPABASE_URL: string;
      readonly SUPABASE_ANON_KEY: string;
      readonly SUPABASE_SECRET_KEY: string;

      readonly DATABASE_DIRECT_UR: string;
      readonly DATABASE_POOLED_URL: string;
      
      readonly DEPLOYER_PRIVATE_KEY: `0x${string}`;

      readonly POOL_FACTORY: `0x${string}`;
      readonly NFTPOOL_FACTORY: `0x${string}`;
      readonly MULTICALL: `0x${string}`;
    }
  }
}

export {};
