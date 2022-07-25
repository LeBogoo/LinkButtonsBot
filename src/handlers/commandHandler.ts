import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";
import { readdirSync } from "fs";

/**
 * @param name Command name
 * @returns If this default command exists
 */
export function isCommand(name: string): boolean {
    const commands = readdirSync("./commands");
    return commands.includes(`${name}.ts`);
}

export default async function (interaction: CommandInteraction) {
    /**
     * Handle default commands (global commands)
     * @todo Make it global commands!
     */
    if (isCommand(interaction.commandName)) {
        const command = (await import(`../commands/${interaction.commandName}.ts`)).default;
        const result = await command.run(interaction);
        if (result) interaction.reply(result);
        return;
    }

    interaction.reply(`Command \`${interaction.commandName}\` not found!`);
}

export type JsonCommand = {
    commandJSON: RESTPostAPIApplicationCommandsJSONBody;
    response: string;
};
