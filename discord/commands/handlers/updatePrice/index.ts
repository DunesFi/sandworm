import { getMergedConfig, MergedConfiguration, validateAsset, validateConfig } from '../../../../core/config';
import chainConfig from '../../../../core/config/chains';
import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';

import { saveAssetDepositEvents } from '../../../../core/spices/actions/assetDeposits';
import { saveTransferEvents } from '../../../../core/spices/actions/transfers';
import { updatePrices } from '../../../../core/spices/actions/updatePrice';

export async function handleUpdatePriceInteraction(client: Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {

  // Immediate acknowledgment
  await client.rest.createInteractionResponse(interaction.id, interaction.token, {
    type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  });

  const subCommand = interaction.data.options?.[0]; // Assuming the sub-command is always the first element

  // Access the nested options within the sub-command, if present
  const eventName = subCommand?.name;
  const assetOption = subCommand?.options?.find(opt => opt.name === 'asset');
  const chainOption = subCommand?.options?.find(opt => opt.name === 'chain');

  // Extract values
  let assetName = assetOption?.value ? assetOption?.value.toString() : undefined;
  let chainName = chainOption?.value ? chainOption?.value.toString() : undefined;

  // Validate asset and chain
  if (!eventName) {
    throw new Error('Invalid or missing input.');
  }

  try {

    const messages = await updatePrices(chainName, assetName)

    // Format the response message with depositSpices results
    const responseMessage = messages.map(message => message).join('\n');

    // Send the actual response after processing
    await client.rest.editOriginalInteractionResponse(client.application.id, interaction.token, {
      content: responseMessage
    });


  } catch (error) {
    console.error(`Error handling updatePrice interaction: ${error.message}`);
    // Send an error message back to the Discord channel
    await client.rest.editOriginalInteractionResponse(client.application.id, interaction.token, {
      content: `Failed to updatePrice: ${error.message}`
    });
  }


}

