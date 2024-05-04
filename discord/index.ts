import { createClient, Intents, InteractionType } from 'lilybird';
import { loadLogs } from '../utils/logs';
import { handler } from './commands';

if (!process.env.DISCORD_BOT_TOKEN)
  throw new Error("FATAL: Missing discord bot token!");

export function setupBot() {
  createClient({
    token: process.env.DISCORD_BOT_TOKEN!!,
    intents: [
      Intents.MESSAGE_CONTENT,
      Intents.GUILD_MESSAGES,
      Intents.GUILD_MEMBERS,
      Intents.GUILDS
    ],
    setup: async (client) => {
      await loadLogs("Started the bot.");
      console.log("Loaded logs ✅");

      await handler.loadGlobalCommands(client);
      console.log("Loaded application commands ✅");

      console.log(`Logged in as: ${client.user.username} (${client.user.id})`);
    },
    listeners: {
      //messageCreate: async (client, payload) => {
        //await handleGithubURLInMessage(client, payload);
      //},
      interactionCreate: async (client, payload) => {
        if (!("guild_id" in payload)) return;

        if (payload.type === InteractionType.MESSAGE_COMPONENT) {
          switch (payload.data.custom_id) {
            case "anime_search_relations": {
              // await handleAnimeSearchRelationsButton(client, payload);
              break;
            }
            case "manga_search_relations": {
              // await handleMangaSearchRelationsButton(client, payload);
              break;
            }
          }
          return;
        } else if (payload.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE)
          return handler.autoComplete[payload.data.name](client, payload);
        else if (payload.type !== InteractionType.APPLICATION_COMMAND) return;

        return handler.commands[payload.data.name](client, payload);
      }
    }
  }).then(async (c) => {
    await c.ping();
  });
}