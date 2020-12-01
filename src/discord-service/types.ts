import { Channel, GuildMember, Message, TextChannel } from 'discord.js';
import { BotAction } from '../domain/action-types';

export type MessageTuple = [channelId: string, messageId: string];

export interface DiscordAPI {
  fetchChannel: (id: string) => Promise<Channel | null>;
  fetchTextChannel: (id: string) => Promise<TextChannel | null>;
  fetchMessage: (channelId: string, messageId: string) => Promise<Message | null>;
  fetchMember: (guildId: string, userId: string) => Promise<GuildMember>;
}

export interface DiscordBot {
  applyAction: (action: BotAction) => Promise<void>;
  start: (discordToken: string) => Promise<void>;
  stop: () => Promise<void>;
}
