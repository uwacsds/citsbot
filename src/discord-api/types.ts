export type MessageTuple = [channelId: string, messageId: string];

export interface DiscordAPI {
  start: (discordToken: string) => Promise<void>;
  stop: () => Promise<void>;
}
