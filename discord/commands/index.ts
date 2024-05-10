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
    description: "Purge all or specific actions for a chain from database",
    options: [
      {
        name: "ethereum",
        description: "Actions related to Spices snapshots on Ethereum",
        type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
        options: [
          {
            name: "deposits",
            description: "Purge all deposits from database",
            type: ApplicationCommandOptionType.SUB_COMMAND
          },
          {
            name: "balances",
            description: "Purge balances from database",
            type: ApplicationCommandOptionType.SUB_COMMAND,
            options: [
              {
                name: "deth",
                description: "Purge dETH deposits from database",
                type: ApplicationCommandOptionType.STRING,
                required: true
              },
              {
                name: "dusd",
                description: "Purge dUSD deposits from database",
                type: ApplicationCommandOptionType.STRING,
                required: true
              },
            ]
          }
        ]
      },
    ]
  },
  handlePurgeInteraction
);