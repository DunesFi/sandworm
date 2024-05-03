import { exists } from './files';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

export async function loadLogs(message: string, error?: boolean): Promise<void> {
  const date = new Date(Date.now());
  const formattedDate = `${new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC"
  }).format(date)}  |  `;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const year = date.getFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const monthName = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate().toString().padStart(2, "0");

  if (!await exists("./logs")) {
    console.log("The logs folder couldn't be found ❌, generating..");
    await mkdir("./logs", { recursive: true });
  }

  if (!await exists(`./logs/${year}`)) {
    console.log(`The year ${year} couldn't be found ❌, generating..`);
    await mkdir(`./logs/${year}`, { recursive: true });
  }

  if (!await exists(`./logs/${year}/${month}`)) {
    console.log(`The month ${monthName}(${month}) couldn't be found ❌, generating..`);
    await mkdir(`./logs/${year}/${month}`, { recursive: true });
  }

  if (!await exists(`./logs/${year}/${month}/${day}.txt`)) {
    console.log(`The day ${day} couldn't be found ❌, generating..`);
    await writeFile(`./logs/${year}/${month}/${day}.txt`, `${formattedDate}Created log file.`);

  } else {
    const todaysLogFile = await readFile(`./logs/${year}/${month}/${day}.txt`, "utf-8");
    await writeFile(`./logs/${year}/${month}/${day}.txt`, `${todaysLogFile}\n${formattedDate}${message}`);
    console[error ? "error" : "log"](`${formattedDate}${message}`);
  }
}