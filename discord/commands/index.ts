import { Client, POSTApplicationCommandStructure } from 'lilybird';
import { readdir } from 'node:fs/promises';
import { DefaultSlashCommand } from '../types/commands';
import { slashCommandsIds } from '../cache';

export const applicationCommands = new Map<string, DefaultSlashCommand>();

export async function loadApplicationCommands(client: Client): Promise<void> {
  const slashCommands: Array<POSTApplicationCommandStructure> = [];
  const temp: Array<Promise<DefaultSlashCommand>> = [];

  // @ts-ignore
  const items = await readdir("./discord/commands", { recursive: true });
  console.log("ITEMS", items);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.toLowerCase() === "index.ts") continue;

    const [category, cmd] = item.split(process.platform === "win32" ? "\\" : "/");
    console.log("category", category, "cmd", cmd)
    if (!category || !cmd) continue;
    if (category === "data") continue;

    const command = import(`./${category}/${cmd}`) as Promise<DefaultSlashCommand>;
    temp.push(command);
  }

  const commands = await Promise.all(temp);
  console.log("commands", commands);

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    const { default: cmd } = command;
    slashCommands.push(cmd.data);
    applicationCommands.set(cmd.data.name, command);
  }

  console.log("slashCommands", slashCommands);

  const commandsIds = await client.rest.bulkOverwriteGlobalApplicationCommand(client.user.id, slashCommands);
  for (let i = 0; i < commandsIds.length; i++) {
    const { name, id } = commandsIds[i];
    slashCommandsIds.set(name, `</${name}:${id}>`);
  }
}
