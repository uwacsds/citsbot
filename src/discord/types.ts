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
  type: `text` | `dm` | `voice` | `group` | `category` | `news` | `store` | `unknown`;
}

export interface DiscordUser {
  id: string;
  createdAt: Date;
  avatar: string;
  bot: boolean | undefined;
  username: string | undefined;
  tag: string | undefined;
  discriminator: string | undefined;
}

export interface DiscordMessageAttachment {
  id: string;
  url: string;
  width: number | undefined;
  height: number | undefined;
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
  isSystemMessage: boolean;
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
