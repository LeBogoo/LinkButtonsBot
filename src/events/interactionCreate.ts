import { Client, Interaction, InteractionType } from "discord.js";
import commandHandler from "../handlers/commandHandler";
import modalSubmitHandler from "../handlers/modalSubmitHandler";

export default function (_client: Client, interaction: Interaction) {
    if (interaction.type == InteractionType.ApplicationCommand) commandHandler(interaction);
    if (interaction.type == InteractionType.ModalSubmit) modalSubmitHandler(interaction);
}
