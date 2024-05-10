import { Client, Interaction, InteractionCallbackType } from 'lilybird';

export async function handlePurgeInteraction(client: Client<any>, interaction: Interaction.GuildApplicationCommandInteractionStructure) {
  const { ws, rest } = await client.ping();

  console.log(JSON.stringify(interaction.data.options, null, 2));

  return client.rest.createInteractionResponse(interaction.id, interaction.token, {
    type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: `🏓 WebSocket: \`${Math.round(ws)}ms\` | Rest: \`${Math.round(rest)}ms\`` }
  })
}