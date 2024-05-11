import { getMergedConfig, MergedConfiguration, validateAsset, validateConfig } from '../../../../core/config';
import chainConfig from '../../../../core/config/chains';
import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';
import { handlePurgeDeposits } from './balances';
import { handlePurgeBalances } from './deposits';

export async function handlePurgeInteraction(client:Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {
  const subCommand = interaction.data
  console.log(subCommand?.options);
  console.log(subCommand?.options?.[0]);

  const { ws, rest } = await client.ping();
  return client.rest.createInteractionResponse(interaction.id, interaction.token, {
    type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: `🏓 WebSocket: \`${Math.round(ws)}ms\` | Rest: \`${Math.round(rest)}ms\`` }
  })
/*
  const asset = interaction.data
  const chain = interaction.data

  // Validate chain argument
  if (chain) {
    const chainId = Object.keys(chainConfig).find(key => chainConfig[Number(key)].networkName === chain);
    if (chainId) {
      const config: MergedConfiguration = getMergedConfig(Number(chainId));

      if (!validateConfig(config)) {
        //await interaction.reply(`❌ Invalid chain: ${chain}`);
        return;
      }

      // Validate asset argument
      if (asset && config && !validateAsset(config, asset)) {
        //await interaction.reply(`❌ Invalid asset: ${asset}`);
        return;
      }

      // Handle subcommands
      if (subCommand === "deposits") {
        await handlePurgeDeposits(interaction, asset, config);
      } else if (subCommand === "balances") {
        await handlePurgeBalances(interaction, asset, config);
      }
    } else {
      // err
    }
  } else {
    // err
  }
  */
}
