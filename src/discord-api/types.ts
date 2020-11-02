export type MessageTuple = [channelId: string, messageId: string];

export interface DiscordAPI {
    start: () => Promise<void>;
    stop: () => Promise<void>;
}
