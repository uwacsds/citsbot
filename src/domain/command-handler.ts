import { BotAction, BotActionType } from "./action-types";
import { BotConfig } from "./config";
import { cowsayModule } from "./cowsay/cowsay";
import { DiscordCommandHandler, DiscordMessage, DiscordReaction, DiscordUser } from "./discord-types";
import { welcomerModule } from "./welcomer/welcomer";


export const discordCommandHandler = (config: BotConfig): DiscordCommandHandler => {
    const isCommand = (module: { prefix: string }, msg: string) => msg.startsWith(`${config.prefix}${module.prefix}`);
    
    return {
        onMessage: (message: DiscordMessage): BotAction => {
            const cowsay = cowsayModule(config.modules.cowsay);
            if (isCommand(cowsay, message.content)) {
                const resp = cowsay.say(message.content);
                return {
                    type: BotActionType.Message,
                    channelId: message.channel.id,
                    messageContent: resp,
                };
            }

            const welcomer = welcomerModule(config.modules.welcomer);
            if (message.channel.id === config.modules.welcomer.channel) {
                return welcomer.waveAtUser(message);
            }

            return { type: BotActionType.Nothing };
        },
        onMemberJoin: (user: DiscordUser) => {
            const welcomer = welcomerModule(config.modules.welcomer);
            return welcomer.welcomeUser(user);
        },
        onReactionAdd: (reaction: DiscordReaction, user: DiscordUser) => {
            console.log('a reaction was added', reaction.emoji.name);
            return { type: BotActionType.Nothing };
        },
        onReactionRemove: (reaction: DiscordReaction, user: DiscordUser) => {
            console.log('a reaction was removed', reaction.emoji.name);
            return { type: BotActionType.Nothing };
        }
    };
};
