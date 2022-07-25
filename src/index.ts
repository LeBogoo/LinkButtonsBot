import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { readdirSync } from "fs";
import { Logger } from "./Logger";
dotenv.config();

export const logger = new Logger("../logs");

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

/**
 * Register all events listed in 'src/events' dir.
 */
readdirSync("./events").forEach(async (file) => {
    const event = (await import("./events/" + file)).default;
    const eventName = file.split(".")[0];
    client.on(eventName, (...args: unknown[]) => event(client, ...args));
});

client.login(process.env.TOKEN);

process.on("uncaughtException", (err) => {
    logger.log(`Unhandled Exception: ${err.message}\n\t${err.stack}`);
});
