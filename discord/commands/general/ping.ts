import type { SlashCommand } from "../../types/commands";
import type { Interaction } from "@lilybird/transformers";

export default {
  data: { name: "ping", description: "pong!!" },
  run: async (interaction: Interaction) => {
    await interaction.deferReply();

    const { ws, rest } = await interaction.client.ping();

    await interaction.editReply({
      content: `🏓 WebSocket: \`${ws.toFixed()}ms\` | Rest: \`${rest.toFixed()}ms\``
    });
  }
} satisfies SlashCommand;