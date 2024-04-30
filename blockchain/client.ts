import { PublicClient } from "viem";
import { createPublicClient, http } from "viem";
import { arbitrum as chain } from "viem/chains";

if (!process.env.RPC_HTTPS) throw new Error("Missing RPC URL");

const transport = http(process.env.RPC_HTTPS);

export type Client = PublicClient<typeof transport, typeof chain>;

export const client: Client = createPublicClient({ transport, chain });
