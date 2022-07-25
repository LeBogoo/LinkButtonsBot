import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js";

export default {
    builder: new SlashCommandBuilder()
        .setDescription("Removes a custom command.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        .addStringOption((option) =>
            option
                .setName("message-text")
                .setDescription("Text of the message to which the link button is attached.")
                .setMaxLength(2000)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("button-text").setDescription("Text of the link button.").setMaxLength(100).setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("button-link").setDescription("Link/URL of the link button.").setRequired(true)
        ),

    run: async function (interaction: CommandInteraction) {
        const messageTextOption = interaction.options.get("message-text", true);
        const buttonTextOption = interaction.options.get("button-text", true);
        const urlOption = interaction.options.get("button-link", true);

        try {
            const validUrl = await axios.get(urlOption.value as string);
            if (validUrl.status != 200) throw new Error("Not ok");

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel(buttonTextOption.value as string)
                    .setURL(urlOption.value as string)
                    .setStyle(ButtonStyle.Link)
            );

            await interaction.channel!.send({ content: messageTextOption.value as string, components: [row] });
            return {
                ephemeral: true,
                content: "Link button created!",
            };
        } catch (err) {
            // @ts-ignore
            console.log(err.message);

            return {
                ephemeral: true,
                content: "The url is invalid. Make sure the destination is reachable!",
            };
        }
    },
};
