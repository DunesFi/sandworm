import { spawnSync } from "bun";
import { dependencies } from "../package.json";

export const COMMIT_HASH = spawnSync({
  cmd: ["git", "log", "--pretty=format:%h", "-n", "1"],
}).stdout.toString();

export const LILYBIRD_VERSION = sliceIfStartsWith(dependencies.lilybird, "^");
export const LILYBIRD_JSX_VERSION = sliceIfStartsWith(
  dependencies["@lilybird/jsx"],
  "^"
);
export const LILYBIRD_HANDLERS_VERSION = sliceIfStartsWith(
  dependencies["@lilybird/handlers"],
  "^"
);

export const PRODUCTION = process.env.NODE_ENV === "production";
export const DEV_MODE = process.env.DEV_MODE === "true";

if (DEV_MODE) {
  if (!process.env.DISCORD_BOT_TOKEN_DEV) {
    throw Error("FATAL: Missing dev discord bot token!");
  }
  process.env.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN_DEV;
} else {
  if (!process.env.DISCORD_BOT_TOKEN_DEV) {
    throw Error("FATAL: Missing discord bot token!");
  }
}

export function sliceIfStartsWith(input: string, startsWith: string) {
  return input.startsWith(startsWith) ? input.slice(startsWith.length) : input;
}