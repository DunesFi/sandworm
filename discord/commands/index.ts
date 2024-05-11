import { CommandManager } from './handlers';
import {
  ApplicationCommandOptionType,
} from 'lilybird';
import { handlePurgeInteraction } from './handlers/purge';
import { handlePingInteraction } from './handlers/ping';

export const handler = new CommandManager();

handler.addCommand({
    name: "ping",
    description: "pong"
  },
  handlePingInteraction
);

handler.addCommand({
    name: "purge",
    description: "Purge all or specific actions logs from database",
    options: [
      {
        name: "deposits",
        description: "Purge deposits from database",
        type: ApplicationCommandOptionType.SUB_COMMAND,
        options: [
          {
            name: "asset",
            description: "Asset to purge balances of",
            type: ApplicationCommandOptionType.STRING,
            required: false // wipe all assets if not specified
          },
          {
            name: "chain",
            description: "Chain to purge balances from",
            type: ApplicationCommandOptionType.STRING,
            required: false // wipe all chains if not specified
          },
        ]
      },
      {
        name: "balances",
        description: "Purge balances from database",
        type: ApplicationCommandOptionType.SUB_COMMAND,
        options: [
          {
            name: "asset",
            description: "Asset to purge balances of",
            type: ApplicationCommandOptionType.STRING,
            required: false // wipe all assets if not specified
          },
          {
            name: "chain",
            description: "Chain to purge balances from",
            type: ApplicationCommandOptionType.STRING,
            required: false // wipe all chains if not specified
          },
        ]
      }
    ]
  },
  handlePurgeInteraction
);