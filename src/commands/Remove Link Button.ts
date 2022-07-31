import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonComponent,
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

export async function removeButtonFromMessage(message: Message, interaction: CommandInteraction) {
    await message.fetch();

    const row = JSON.parse(JSON.stringify(message.components[0] || { type: 1, components: [] }));

    const modal = new ModalBuilder()
        .setTitle("Remove Link Button")
        .setCustomId(JSON.stringify({ trigger: "Remove Link Button", data: [message.channelId, message.id] }));

    // const selectMenu = new SelectMenuBuilder();
    // for (let component of row.components) {
    //     console.log(component);
    //     selectMenu.addOptions(new SelectMenuOptionBuilder().setLabel(component.label).setDescription(component.url));
    // }

    // const selectMenuRow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(selectMenu);

    // modal.addComponents(selectMenuRow);

    const buttonText = new TextInputBuilder()
        .setCustomId("buttonText")
        .setLabel("Button Text")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(79)
        .setMinLength(1)
        .setPlaceholder("Text of button you want  to remove");

    const buttonTextRow = new ActionRowBuilder<TextInputBuilder>().addComponents(buttonText);

    modal.addComponents(buttonTextRow);

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
        if (row.components.length == 0)
            return {
                ephemeral: true,
                content: `You can only remove Buttons if they exist.`,
            };

        removeButtonFromMessage(interaction.targetMessage, interaction);
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

        let row = JSON.parse(JSON.stringify(message.components[0] || { type: 1, components: [] }));

        row.components = row.components.filter((component: ButtonComponent) => component.label != buttonText);

        if (row.components.length == 0) await message.edit({ components: [] });
        else await message.edit({ components: [row] });

        await interaction.editReply("Removed button from message!");
    },
};
