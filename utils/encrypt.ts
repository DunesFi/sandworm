import { c } from "tasai";
import { createCipheriv, randomBytes } from "node:crypto";

const keyString = process.env.KEY ?? randomBytes(32);
const ivString = process.env.IV ?? randomBytes(16);

if (typeof process.env.KEY === "undefined" || typeof process.env.IV === "undefined")
  console.log(c.yellow("WARNING: using random KEY and IV. This means you won't be able to save your encrypted data"));

const key = typeof keyString === "string" ? Buffer.from(keyString.split(",").map(Number)) : keyString;
const iv = typeof ivString === "string" ? Buffer.from(ivString.split(",").map(Number)) : ivString;
const algorithm = "aes-256-cbc";

export function encrypt(text: string): string {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}