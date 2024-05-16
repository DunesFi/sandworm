import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';
import { verifyDepositPoints } from '../../../../core/spices/actions/verify';

export async function handleVerifyInteraction(client: Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {

  // Immediate acknowledgment
  await client.rest.createInteractionResponse(interaction.id, interaction.token, {
    type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  });

  const subCommand = interaction.data.options?.[0]; // Assuming the sub-command is always the first element

  // Access the nested options within the sub-command, if present
  const eventName = subCommand?.name;
  const assetOption = subCommand?.options?.find(opt => opt.name === 'asset');
  const chainOption = subCommand?.options?.find(opt => opt.name === 'chain');
  const userAddress = subCommand?.options?.find(opt => opt.name === 'user');

  // Extract values
  const assetName = assetOption?.value ? assetOption?.value.toString() : undefined;
  const chainName = chainOption?.value ? chainOption?.value.toString() : undefined;

  // Extract values
  const user = userAddress?.value;

  // Validate asset and chain
  if (!eventName || !user) {
    throw new Error('Invalid or missing input.');
  }

  try {
    // Execute the verify function
    const depositSpices = await verifyDepositPoints(user.toString(), chainName, assetName);

    // Format the response message with depositSpices results
    const responseMessage = `Verification for ${eventName} completed:\n` +
      depositSpices.map(spice => `chain: ${spice.chainId}, ${spice.assetName}: ${spice.mintPoints} mint points, ${spice.refPoints} referral points`).join('\n');

    // Send the actual response after processing
    await client.rest.editOriginalInteractionResponse(client.application.id, interaction.token, {
      content: responseMessage
    });

  } catch (error) {
    console.error(`Error handling verify interaction: ${error.message}`);
    // Send an error message back to the Discord channel
    await client.rest.editOriginalInteractionResponse(client.application.id, interaction.token, {
      content: `Failed to verify event: ${error.message}`
    });
  }
}
