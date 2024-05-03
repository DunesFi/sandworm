import { mkdir, access, readFile, writeFile, readdir } from "node:fs/promises";

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (e) {
    return false;
  }
}