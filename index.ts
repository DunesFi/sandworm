/*
import { PrismaClient } from '@prisma/client';
import { client } from './blockchain/client';
import { sync as syncPools } from './core/pools';
import { sync as syncSwaps } from './core/swaps';
import { sync as syncTokens } from './core/tokens';

const prisma = new PrismaClient();

await syncPools(client, prisma);
await syncTokens(client, prisma);
await syncSwaps(client, prisma);
*/


import express from 'express';
import { Client, GatewayIntentBits, Collection, PermissionFlagsBits,} from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

//import { Command, SlashCommand } from "./types";

config()

const app = express();
const port = 80;

app.get("/", (req, res) => {
    res.send("Shai-Hulud!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})

//client.slashCommands = new Collection<string, SlashCommand>()
//client.commands = new Collection<string, Command>()
//client.cooldowns = new Collection<string, number>()

//const handlersDir = join(__dirname, "./handlers")
//readdirSync(handlersDir).forEach(handler => {
//    if (!handler.endsWith(".js")) return;
//    require(`${handlersDir}/${handler}`)(client)
//})

client.login(process.env.DISCORD_BOT_TOKEN).then()