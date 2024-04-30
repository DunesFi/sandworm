import type { PublicClient, WalletClient } from "viem";
import { createPublicClient, createWalletClient, http } from "viem";
import { arbitrum as chain } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const { DEPLOYER_PRIVATE_KEY, RPC_HTTPS } = process.env;

const transport = http(RPC_HTTPS);

type Client = {
  public: PublicClient<typeof transport, typeof chain>;
  wallet: WalletClient<typeof transport, typeof chain>;
};

export const client: Client = {
  public: createPublicClient({ chain, transport }),

  wallet: createWalletClient({
    chain,
    transport,
    account: privateKeyToAccount(DEPLOYER_PRIVATE_KEY),
  }),
};

export default client;
