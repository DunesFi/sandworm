import { CommandManager } from './handler';
import { InteractionCallbackType } from 'lilybird';

export const handler = new CommandManager();

handler.addCommand({
  name: "ping",
  description: "pong"
}, async (client, interaction) => {
  const { ws, rest } = await client.ping();
  return client.rest.createInteractionResponse(interaction.id, interaction.token, {
    type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: `🏓 WebSocket: \`${Math.round(ws)}ms\` | Rest: \`${Math.round(rest)}ms\`` }
  });
});