import { BotAction } from './action-types';

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

export interface DiscordMessage {
    id: string;
    author: DiscordUser;
    channel: DiscordChannel;
    content: string;
    createdAt: Date;
    deletable: boolean;
}

export interface DiscordEmoji {
    name: string;
}

export interface DiscordReaction {
    count: number;
    message: DiscordMessage;
    emoji: DiscordEmoji;
}

export interface DiscordCommandHandler {
    onMessage: (msg: DiscordMessage) => Promise<BotAction>,
    onMemberJoin: (user: DiscordUser) => Promise<BotAction>,
    onReactionAdd: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction>,
    onReactionRemove: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction>,
}
