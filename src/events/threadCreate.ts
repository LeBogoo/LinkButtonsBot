import { Client, ThreadChannel } from "discord.js";
import { logger } from "..";
export default function (_client: Client, threadChannel: ThreadChannel, newlyCreated: boolean) {
    if (newlyCreated) logger.log(`Thread created: ${threadChannel.name}`);
    if (!newlyCreated) logger.log(`Thread joined: ${threadChannel.name}`);
    threadChannel.join();
}
