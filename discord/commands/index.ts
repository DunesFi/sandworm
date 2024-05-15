import { CommandManager } from './handlers';
import {
  ApplicationCommandOptionType,
} from 'lilybird';
import { handlePurgeInteraction } from './handlers/purge';
import { handlePingInteraction } from './handlers/ping';
import { handleSnapShotInteraction } from './handlers/snapshots';

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
            description: "Asset address to purge balances of",
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
        name: "transfers",
        description: "Purge transfers from database",
        type: ApplicationCommandOptionType.SUB_COMMAND,
        options: [
          {
            name: "asset",
            description: "Asset address to purge balances of",
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



handler.addCommand({
  name: "snapshot",
  description: "Record specific blockchain events to a database",
  options: [
    {
      name: "transfers",
      description: "Record Transfer events for a specified asset",
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "asset",
          description: "The asset name for which transfer events will be tracked",
          type: ApplicationCommandOptionType.STRING,
          required: true
        },
        {
          name: "chain",
          description: "The blockchain network",
          type: ApplicationCommandOptionType.STRING,
          required: true
        },
      ]
    },
    {
      name: "deposits",
      description: "Record AssetDeposit events for a specified LRT asset",
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "asset",
          description: "The LRT asset name for which deposit events will be tracked",
          type: ApplicationCommandOptionType.STRING,
          required: true
        },
        {
          name: "chain",
          description: "The blockchain network",
          type: ApplicationCommandOptionType.STRING,
          required: true
        },
      ]
    }
  ]
},
  handleSnapShotInteraction
);
