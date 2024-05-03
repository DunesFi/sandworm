import { createHandler } from '@lilybird/handlers';
import { CachingDelegationType, createClient, Intents } from 'lilybird';
import { Channel, Guild, GuildVoiceChannel } from "@lilybird/transformers";
import { loadLogs } from '../utils/logs';
import { loadApplicationCommands } from './commands';

if (!process.env.DISCORD_BOT_TOKEN)
  throw new Error("FATAL: Missing discord bot token!");

const listeners = await createHandler({
  dirs: {
    listeners: `${import.meta.dir}/listeners`
  }
});

export function setupBot() {
  createClient({
    token: process.env.DISCORD_BOT_TOKEN!!,
    caching: {
      transformerTypes: { channel: Channel, guild: Guild, voiceState: GuildVoiceChannel },
      delegate: CachingDelegationType.DEFAULT,
      applyTransformers: true,
      enabled: { channel: true }
    },
    intents: [
      Intents.GUILDS,
      Intents.GUILD_MESSAGES,
      Intents.MESSAGE_CONTENT,
      Intents.GUILD_MEMBERS
    ],
    ...listeners,
    setup: async (client) => {
      // await listeners.setup(client)

      await loadLogs("Started the bot.");
      console.log("Loaded logs ✅");
      await loadApplicationCommands(client);
      console.log("Loaded application commands ✅");
      console.log(`Logged in as: ${client.user.username} (${client.user.id})`);
      },
  }).then();
}