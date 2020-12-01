import { DiscordUser } from './discord-types';

export enum BotActionType {
  Nothing = 'Nothing',
  Message = 'Message',
  RemoveMessage = 'RemoveMessage',
  EmbeddedMessage = 'EmbeddedMessage',
  RoleGrant = 'RoleGrant',
  RoleRevoke = 'RoleRevoke',
  AddReaction = 'AddReaction',
  RemoveReaction = 'RemoveReaction',
}

interface BotBaseAction {
  type: BotActionType;
  delay?: number;
}

export interface BotMessageAction extends BotBaseAction {
  type: BotActionType.Message;
  channelId: string;
  messageContent: string;
}

export interface BotEmbeddedMessageAction extends BotBaseAction {
  type: BotActionType.EmbeddedMessage;
  channelId: string;
  embed: {
    colour?: string;
    title?: string;
    url?: string;
    author?: {
      name: string;
      iconsUrl?: string;
      url?: string;
    };
    description?: string;
    thumbnail?: string;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    image?: string;
    timestamp?: Date | number;
    footer?: {
      text: string;
      iconUrl?: string;
    };
  };
}

export interface BotAddReactionAction extends BotBaseAction {
  type: BotActionType.AddReaction;
  channelId: string;
  messageId: string;
  emoji: string;
}

export interface BotRemoveReactionAction extends BotBaseAction {
  type: BotActionType.RemoveReaction;
  messageId: string;
  emoji: string;
}

export interface BotRoleGrantAction extends BotBaseAction {
  type: BotActionType.RoleGrant;
  user: DiscordUser;
  guild: string;
  role: string;
}

export interface BotRoleRevokeAction extends BotBaseAction {
  type: BotActionType.RoleRevoke;
  user: DiscordUser;
  guild: string;
  role: string;
}

export interface BotRemoveMessageAction extends BotBaseAction {
  type: BotActionType.RemoveMessage;
  channelId: string;
  messageId: string;
}

export type BotAction =
  | BotMessageAction
  | BotRoleGrantAction
  | BotRoleRevokeAction
  | BotEmbeddedMessageAction
  | BotAddReactionAction
  | BotRemoveReactionAction
  | BotRemoveMessageAction;
