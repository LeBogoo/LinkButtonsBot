import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import { logger } from "..";

dotenv.config();

export default async function (client: Client) {
    logger.log(`${client.user?.username} is ready!`);

    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const defaultCommands = readdirSync("./commands");
    for (let i = 0; i < defaultCommands.length; i++) {
        const command = (await import(`../commands/${defaultCommands[i]}`)).default;

        const commandName = defaultCommands[i].split(".")[0];
        const builder = command.builder as SlashCommandBuilder;
        builder.setName(commandName);
        commands.push(builder.toJSON());
    }

    /**
     * Register all commands to each guild
     */
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);
    client.guilds.cache.forEach(async (guild) => {
        /**
         * Send all commands to guild
         */
        rest.put(Routes.applicationGuildCommands(client.application!.id, guild.id), {
            body: [],
        });
    });
}
