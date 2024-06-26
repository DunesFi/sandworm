import { CacheManagerStructure, Client, Interaction, InteractionCallbackType, Transformers } from 'lilybird';

export async function handlePingInteraction(client:Client<Transformers, CacheManagerStructure>, interaction: Interaction.GuildApplicationCommandInteractionStructure){
  const { ws, rest } = await client.ping();
  return client.rest.createInteractionResponse(interaction.id, interaction.token, {
    type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: `🏓 WebSocket: \`${Math.round(ws)}ms\` | Rest: \`${Math.round(rest)}ms\`` }
  })
}