import type { ApplicationCommandData, GuildInteraction } from "@lilybird/transformers";
import type { POSTApplicationCommandStructure } from "lilybird";

type Awaitable<T> = Promise<T> | T;

export interface SlashCommand {
  data: POSTApplicationCommandStructure;
  run: (interaction: GuildInteraction<ApplicationCommandData>) => Awaitable<any>;
}

export interface DefaultSlashCommand {
  default: SlashCommand;
}
