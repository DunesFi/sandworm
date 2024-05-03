import { config } from "dotenv";
import { healthCheck } from '@/server';
import { loadLogs } from '@/utils/logs';
import { setupBot } from './discord';
config()

// handle exceptions at process level
process.on("unhandledRejection", async (error: Error) => {
  await loadLogs(`ERROR: uncaught exception: ${error.stack}`, true);
});
process.on("uncaughtException", async (error: Error) => {
  await loadLogs(`ERROR: uncaught exception: ${error.stack}`, true);
});
process.on("exit", async (code: number) => {
  await loadLogs(`ERROR: the client exited with code ${code}`, true);
});

// start health check server
healthCheck()

// start discord
setupBot()