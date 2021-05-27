import { Channel, GuildMember, Message, TextChannel } from 'discord.js';
import { BotAction } from '../domain/action-types';

export interface DiscordAPI {
  fetchChannel: (id: string) => Promise<Channel | undefined>;
  fetchTextChannel: (id: string) => Promise<TextChannel | undefined>;
  fetchMessage: (channelId: string, messageId: string) => Promise<Message | undefined>;
  fetchMember: (userId: string) => Promise<GuildMember>;
}

export interface DiscordBot {
  applyAction: (action: BotAction) => void;
  start: (discordToken: string) => Promise<string>;
  stop: () => void;
}

export interface DiscordChannel {
  id: string;
  createdAt: Date;
  type: 'text' | 'dm' | 'voice' | 'group' | 'category' | 'news' | 'store' | 'unknown';
}

export interface DiscordUser {
  id: string;
  createdAt: Date;
  avatar: string;
  bot: boolean | null;
  username: string | null;
  tag: string | null;
  discriminator: string | null;
}

export interface DiscordMessageAttachment {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number;
}

export interface DiscordMessage {
  id: string;
  author: DiscordUser;
  channel: DiscordChannel;
  content: string;
  createdAt: Date;
  deletable: boolean;
  attachments: DiscordMessageAttachment[];
}

export interface DiscordEmoji {
  id: string;
  name: string;
}

export interface DiscordReaction {
  count: number;
  message: DiscordMessage;
  emoji: DiscordEmoji;
}
