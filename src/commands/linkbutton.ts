import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js";
import { logger } from "..";

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
            interaction.reply({ephemeral:true, content:"Checking URL..."})
            const validUrl = await axios.get(urlOption.value as string, {timeout: 5000});
            if (validUrl.status != 200) throw new Error("Not ok");
            
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel(buttonTextOption.value as string)
                    .setURL(urlOption.value as string)
                    .setStyle(ButtonStyle.Link)
            );

            await interaction.channel!.send({ content: messageTextOption.value as string, components: [row] });
            
                logger.log(`LinkButton created: ${messageTextOption.value} |  ${buttonTextOption.value} | ${urlOption.value}`)

            interaction.editReply({
                content: "Link button created!",
            });
        } catch (err) {
            // @ts-ignore
            logger.log(err.message);

            interaction.editReply({
                content: "The URL is invalid. Make sure the destination is reachable!",
            });
        }
    },
};
