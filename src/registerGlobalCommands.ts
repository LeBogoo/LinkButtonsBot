import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import dotenv from "dotenv";
import { readdirSync } from "fs";

dotenv.config();

(async () => {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const defaultCommands = readdirSync("./commands");
    for (let i = 0; i < defaultCommands.length; i++) {
        const command = (await import(`./commands/${defaultCommands[i]}`)).default;

        const commandName = defaultCommands[i].split(".")[0];
        const builder = command.builder as SlashCommandBuilder;
        builder.setName(commandName);
        commands.push(builder.toJSON());
    }

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);
    rest.put(Routes.applicationCommands(process.env.APP_ID!), {
        body: commands,
    });
    console.log(commands);
    console.log("Registered commands.");
})();
