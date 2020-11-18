import { BotAction } from "../domain/action-types";

export type MessageTuple = [channelId: string, messageId: string];

export interface DiscordAPI {
  applyAction: (action: BotAction) => Promise<void>;
  start: (discordToken: string) => Promise<void>;
  stop: () => Promise<void>;
}
