export interface DiscordAPI {
    start: () => Promise<void>;
    stop: () => Promise<void>;
}
