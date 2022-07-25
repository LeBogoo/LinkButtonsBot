import { Client, Interaction, InteractionType } from "discord.js";
import commandHandler from "../handlers/commandHandler";

export default function (_client: Client, interaction: Interaction) {
    if (interaction.type == InteractionType.ApplicationCommand) commandHandler(interaction);
}
