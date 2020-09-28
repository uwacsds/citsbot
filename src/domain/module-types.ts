import { BotAction, BotEmbeddedMessageAction } from "./action-types";
import { DiscordMessage, DiscordUser } from "./discord-types";

export enum ModuleType {
    Cowsay,
    Welcomer,
    ReactRoles,
    StackOverflow,
    Announcer,
}

export interface BaseModule {
    type: ModuleType;
}

export interface CowsayModule extends BaseModule {
    type: ModuleType.Cowsay;
    prefix: 'cowsay';
    say: (message: string) => string;
}

export interface WelcomerModule extends BaseModule {
    type: ModuleType.Welcomer;
    welcomeUser: (user: DiscordUser) => BotEmbeddedMessageAction;
    waveAtUser: (message: DiscordMessage) => BotAction;
}

export interface ReactRolesModule extends BaseModule {
    type: ModuleType.ReactRoles;
    grantRole: () => void;
    revokeRole: () => void;
}

export type BotModule =
    | CowsayModule
    | WelcomerModule
    | ReactRolesModule
