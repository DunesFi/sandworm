import { getMergedConfig, MergedConfiguration, validateAsset, validateConfig } from '../../../../core/config';
import chainConfig from '../../../../core/config/chains';
import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';

import { saveAssetDepositEvents } from '../../../../core/spices/actions/assetDeposits';
import { saveTransferEvents } from '../../../../core/spices/actions/transfers';

export async function handleSnapShotInteraction(client: Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {

  const subCommand = interaction.data.options?.[0]; // Assuming the sub-command is always the first element

  // Access the nested options within the sub-command, if present

  const eventName = subCommand?.name;
  const assetOption = subCommand?.options?.find(opt => opt.name === 'asset');
  const chainOption = subCommand?.options?.find(opt => opt.name === 'chain');

  // Extract values
  const assetName = assetOption?.value;
  const chainName = chainOption?.value;

  // Validate asset and chain
  if (!eventName || !assetName || !chainName) {
    throw new Error('Invalid or missing input.');
  }

  if (eventName == 'deposits') {
    await saveAssetDepositEvents(chainName.toString(), assetName.toString(),)
  } else {
    await saveTransferEvents(chainName.toString(), assetName.toString(),)
  }


}

