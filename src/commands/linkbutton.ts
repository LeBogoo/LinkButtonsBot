import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";
import { addButtonToMessage } from "./Add Link Button";
export default {
    builder: new SlashCommandBuilder()
        .setDescription("Creates a Message with link buttons")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        .addStringOption((option) =>
            option
                .setName("message-text")
                .setDescription("Text of the message to which the link button is attached.")
                .setMaxLength(2000)
                .setRequired(true)
        ),

    run: async function (interaction: CommandInteraction) {
        const messageTextOption = interaction.options.get("message-text", true);
        const message = await interaction.channel?.send({
            content: messageTextOption.value!.toString(),
        });
        if (message) await addButtonToMessage(message, interaction);
    },
};
