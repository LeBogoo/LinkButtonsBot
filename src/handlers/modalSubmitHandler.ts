import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ModalSubmitInteraction } from "discord.js";
import { isCommand } from "./commandHandler";

export default async function (interaction: ModalSubmitInteraction) {
    const { trigger }: { trigger: string } = JSON.parse(interaction.customId);

    if (isCommand(trigger)) {
        const command = (await import(`../commands/${trigger}.ts`)).default;
        const result = await command.modalSubmit(interaction);
        if (result) interaction.reply(result);
        return;
    }

    interaction.reply(`Modal handler for \`${trigger}\` not found!`);
}

export type JsonCommand = {
    commandJSON: RESTPostAPIApplicationCommandsJSONBody;
    response: string;
};
