import type { Awaitable, Interaction } from "lilybird";
import { ApplicationCommandOptionType, type ApplicationCommand, type Client } from "lilybird";

type ApplicationCommandJSONParams = ApplicationCommand.Create.ApplicationCommandJSONParams;
type InteractionExecutor = (client: Client, interaction: Interaction.GuildApplicationCommandInteractionStructure) => Awaitable<unknown>;

export class CommandManager {
  public readonly commands: Record<string, InteractionExecutor> = {};
  public readonly autoComplete: Record<string, InteractionExecutor> = {};

  readonly #commands: Array<ApplicationCommandJSONParams> = [];
  readonly #cachePath: string;

  public constructor(path: string = `${import.meta.dir}/../lily-cache/commands.json`) {
    this.#cachePath = path;
  }

  public addCommand(
    command: ApplicationCommandJSONParams,
    commandExecutor: InteractionExecutor,
    autoCompleteExecutor?: InteractionExecutor
  ): void {
    this.commands[command.name] = commandExecutor;
    if (typeof autoCompleteExecutor !== "undefined") this.autoComplete[command.name] = autoCompleteExecutor;
    this.#commands.push(command);
  }

  #differOption(
    incoming: ApplicationCommand.OptionStructureWithoutNarrowing,
    cached: ApplicationCommand.OptionStructureWithoutNarrowing
  ): boolean {
    if (incoming.type !== cached.type) return true;

    const differentName = incoming.name !== cached.name;
    const differentDescription = incoming.description !== cached.description;
    const differentRequired = incoming.required !== cached.required;

    const base = differentName || differentDescription || differentRequired;

    switch (incoming.type) {
      case ApplicationCommandOptionType.SUB_COMMAND:
      case ApplicationCommandOptionType.SUB_COMMAND_GROUP: {
        if (incoming.options?.length !== cached.options?.length) return true;

        this._differCached(incoming, cached)

        return base;
      }
      case ApplicationCommandOptionType.NUMBER:
      case ApplicationCommandOptionType.INTEGER: {
        const differentMinValue = incoming.min_value !== cached.min_value;
        const differentMaxValue = incoming.max_value !== cached.max_value;

        return base || differentMinValue || differentMaxValue;
      }
      case ApplicationCommandOptionType.STRING: {
        const differentMinLength = incoming.min_length !== cached.min_length;
        const differentMaxLength = incoming.max_length !== cached.max_length;

        return base || differentMinLength || differentMaxLength;
      }
      case ApplicationCommandOptionType.CHANNEL: {
        const differentChannelTypes = incoming.channel_types?.length !== cached.channel_types?.length;

        return base || differentChannelTypes;
      }
      case ApplicationCommandOptionType.BOOLEAN:
      case ApplicationCommandOptionType.USER:
      case ApplicationCommandOptionType.ROLE:
      case ApplicationCommandOptionType.MENTIONABLE:
      case ApplicationCommandOptionType.ATTACHMENT: {
        return base;
      }
    }
  }

  #differ(incoming: ApplicationCommandJSONParams, cached: ApplicationCommandJSONParams): boolean {
    if (incoming.options?.length !== cached.options?.length) return true;

    const differentName = incoming.name !== cached.name;
    const differentDescription = incoming.description !== cached.description;
    const differentDefaultPermissions = incoming.default_member_permissions !== cached.default_member_permissions;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const differentDMpermission = incoming.dm_permission !== cached.dm_permission;
    const differentType = incoming.type !== cached.type;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const differentNSFW = incoming.nsfw !== cached.nsfw;

    this._differCached(incoming, cached);

    return differentType
      || differentName
      || differentDescription
      || differentNSFW
      || differentDMpermission
      || differentDefaultPermissions;
  }

  public async loadGlobalCommands(client: Client): Promise<void> {
    const file = Bun.file(this.#cachePath);

    if (!await file.exists()) {
      console.log("Publish all commands & creating cache");
      await Bun.write(file, JSON.stringify(this.#commands));
      await client.rest.bulkOverwriteGlobalApplicationCommand(client.user.id, this.#commands);
      return;
    }

    const cachedCommands = await file.json() as Array<ApplicationCommandJSONParams>;
    const toPublish: Array<ApplicationCommandJSONParams> = [];

    for (let i = 0, { length } = this.#commands; i < length; i++) {
      const command = this.#commands[i];
      const cachedIndex = cachedCommands.findIndex((c) => c.name === command.name);
      if (cachedIndex === -1) {
        toPublish.push(command);
        cachedCommands.push(command);
        continue;
      }

      if (!this.#differ(command, cachedCommands[cachedIndex])) continue;
      toPublish.push(command);
      cachedCommands[cachedIndex] = command;
    }

    if (toPublish.length < 1) {
      console.log("All commands were cached, nothing to update");
      return;
    }

    console.log("Publishing changed commands", toPublish);
    // For some reason using bulkOverwriteGlobalApplicationCommand with only a set of commands deletes the ones not included...
    // I did not find any discord documentation on this but its the behavior i observed.
    // eslint-disable-next-line no-await-in-loop
    for (let i = 0, { length } = toPublish; i < length; i++) await client.rest.createGlobalApplicationCommand(client.user.id, toPublish[i]);
    await Bun.write(file, JSON.stringify(cachedCommands));
  }

  _differCached(incoming: ApplicationCommandJSONParams | ApplicationCommand.OptionStructureWithoutNarrowing,
                             cached: ApplicationCommandJSONParams | ApplicationCommand.OptionStructureWithoutNarrowing) {
    if (typeof incoming.options !== "undefined" && typeof cached.options !== "undefined") {
      for (let i = 0, { length } = incoming.options; i < length; i++) {
        const option = incoming.options[i];
        const cachedIndex = cached.options.findIndex((op: { name: any; }) => op.name === option.name);

        if (!this.#differOption(option, cached.options[cachedIndex])) continue;
        return true;
      }
    }
  }
}