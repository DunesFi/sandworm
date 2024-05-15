import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';
import { purgeData } from '../../../../core/spices/actions/purge';

export async function handlePurgeInteraction(client: Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {

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
  const assetAddress = assetOption?.value ? assetOption?.value.toString() : undefined;
  const chainName = chainOption?.value ? chainOption?.value.toString() : undefined;

  try {
    // Determine the table based on the event name
    const tableName = eventName === 'deposits' ? 'assetDeposits' : 'transfers';

    // Execute the purge function
    await purgeData(tableName, chainName, assetAddress);

    // Send the actual response after processing
    await client.rest.editOriginalInteractionResponse(client.application.id, interaction.token, {
      content: `Successfully purged ${eventName} event for ${assetAddress} on ${chainName}.`
    });

  } catch (error) {
    console.error(`Error handling purge interaction: ${error.message}`);
    // Send an error message back to the Discord channel
    await client.rest.editOriginalInteractionResponse(client.application.id, interaction.token, {
      content: `Failed to purge event: ${error.message}`
    });
  }
}
