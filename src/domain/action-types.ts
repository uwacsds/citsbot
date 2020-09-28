export enum BotActionType {
    Nothing = 'Nothing',
    Message = 'Message',
    EmbeddedMessage = 'EmbeddedMessage',
    RoleGrant = 'RoleGrant',
    RoleRevoke = 'RoleRevoke',
    AddReaction = 'AddReaction',
    RemoveReaction = 'RemoveReaction',
}

interface BotBaseAction {
    type: BotActionType,
    delay?: number;
}

export interface BotNothingAction extends BotBaseAction {
    type: BotActionType.Nothing,
}

export interface BotMessageAction extends BotBaseAction {
    type: BotActionType.Message,
    channelId: string;
    messageContent: string;
}

export interface BotEmbeddedMessageAction extends BotBaseAction {
    type: BotActionType.EmbeddedMessage,
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
    }
}

export interface BotAddReactionAction extends BotBaseAction {
    type: BotActionType.AddReaction,
    channelId: string;
    messageId: string;
    emoji: string;
}

export interface BotRemoveReactionAction extends BotBaseAction {
    type: BotActionType.RemoveReaction,
    messageId: string;
    emoji: string;
}

export interface BotRoleGrantAction extends BotBaseAction {
    type: BotActionType.RoleGrant,
    user: string;
    role: string;
}

export interface BotRoleRevokeAction extends BotBaseAction {
    type: BotActionType.RoleRevoke,
    user: string;
    role: string;
}

export type BotAction =
    | BotNothingAction
    | BotMessageAction
    | BotRoleGrantAction
    | BotRoleRevokeAction
    | BotEmbeddedMessageAction
    | BotAddReactionAction
    | BotRemoveReactionAction
