import type { Interaction } from "@lilybird/transformers";
import type { Event } from "@lilybird/handlers";
import { applicationCommands } from "../commands";
import { loadLogs } from '../../utils/logs';

export default {
  event: "interactionCreate",
  run
} satisfies Event<"interactionCreate">;

async function run(interaction: Interaction): Promise<void> {

  if (interaction.isApplicationCommandInteraction() && interaction.inGuild()) {
    const { username } = interaction.member.user;

    const commandDefault = applicationCommands.get(interaction.data.name);
    if (!commandDefault) return;
    const { default: command } = commandDefault;

    const guild = await interaction.client.rest.getGuild(interaction.guildId);

    try {
      await command.run(interaction);
      await loadLogs(`INFO: [${guild.name}] ${username} used slash command \`${command.data.name}\`${interaction.data.subCommand ? ` -> \`${interaction.data.subCommand}\`` : ""}`);

    } catch (error) {
      const err = error as Error;
      console.log(error);
      await loadLogs(
        `ERROR: [${guild.name}] ${username} had an error running slash command \`${command.data.name}\`${interaction.data.subCommand ? ` -> \`${interaction.data.subCommand}\`` : ""}: ${err.stack}`,
        true
      );
    }
  }
}
