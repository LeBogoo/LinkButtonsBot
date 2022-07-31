import axios from "axios";
import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    Message,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { logger } from "..";

export async function addButtonToMessage(message: Message, interaction: CommandInteraction) {
    await message.fetch();

    const modal = new ModalBuilder()
        .setTitle("Add Link Button")
        .setCustomId(JSON.stringify({ trigger: "Add Link Button", data: [message.channelId, message.id] }));

    const buttonText = new TextInputBuilder()
        .setCustomId("buttonText")
        .setLabel("Button Text")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(79)
        .setMinLength(1)
        .setPlaceholder("Button Text");

    const buttonUrl = new TextInputBuilder()
        .setCustomId("buttonUrl")
        .setLabel("Button URL")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder("https://...");

    const buttonTextRow = new ActionRowBuilder<TextInputBuilder>().addComponents(buttonText);
    const buttonUrlRow = new ActionRowBuilder<TextInputBuilder>().addComponents(buttonUrl);

    modal.addComponents(buttonTextRow, buttonUrlRow);

    interaction.showModal(modal);
}

export default {
    builder: new ContextMenuCommandBuilder()
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setType(ApplicationCommandType.Message),

    run: async function (interaction: ContextMenuCommandInteraction) {
        if (!interaction.isMessageContextMenuCommand()) return;
        if (interaction.targetMessage.author.id != interaction.client.user!.id)
            return {
                ephemeral: true,
                content: `Please use this only on messages sent by <@${interaction.client.user!.id}>`,
            };

        const row = JSON.parse(JSON.stringify(interaction.targetMessage.components[0] || { type: 1, components: [] }));
        if (row.components.length == 5)
            return {
                ephemeral: true,
                content: `A message can only fit 5 Buttons.`,
            };

        addButtonToMessage(interaction.targetMessage, interaction);
    },

    modalSubmit: async function (interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const {
            trigger,
            data: [channelId, messageId],
        }: { trigger: string; data: [string, string] } = JSON.parse(interaction.customId);

        const messageChannel: TextChannel | undefined = interaction.client.channels.cache.find(
            (channel) => channel.id == channelId
        ) as TextChannel | undefined;

        if (!messageChannel) return interaction.editReply("Message channel not found.");

        const message = await messageChannel.messages.fetch(messageId);
        if (!message) return interaction.editReply("Original message not found.");

        const buttonText = interaction.fields.getTextInputValue("buttonText");
        const buttonUrl = interaction.fields.getTextInputValue("buttonUrl");

        try {
            const validUrl = await axios.get(buttonUrl as string, { timeout: 5000 });
            if (validUrl.status != 200) throw new Error("Not ok");

            const newButton = new ButtonBuilder()
                .setLabel(buttonText)
                .setStyle(ButtonStyle.Link)
                .setURL(buttonUrl)
                .toJSON();

            const row = JSON.parse(JSON.stringify(message.components[0] || { type: 1, components: [] }));

            row.components.push(newButton);

            await message.edit({ components: [row] });
            await interaction.editReply("Added link button to message!");
        } catch (err) {
            // @ts-ignore
            logger.log(err.message);

            interaction.editReply({
                content: "The URL is invalid. Make sure the destination is reachable!",
            });
        }
    },
};
