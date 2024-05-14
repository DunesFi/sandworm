import { getMergedConfig, MergedConfiguration, validateAsset, validateConfig } from '../../../../core/config';
import chainConfig from '../../../../core/config/chains';
import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';

export async function handleDepositInteraction(client: Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {
  const { options } = interaction.data;
  const assetName = options?.find(option => option.name === 'asset')?.value;
  const chainName = options?.find(option => option.name === 'chain')?.value;



}
