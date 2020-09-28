import { CowsayConfig } from "./cowsay/cowsay";
import { WelcomerConfig } from "./welcomer/welcomer";

export interface BotConfig {
    prefix: string;
    guild: string;
    logChannel: string;
    units: {
        [key: string]: {
            name: string;
            role: string;
            channels: {
                general: string;
                resources: string;
            }
        }
    },
    modules: {
        cowsay: CowsayConfig,
        welcomer: WelcomerConfig,
        announcer: {
            channel: string;
            crontab: string;
        },
        reactRoles: {
            messages: Array<{
                id: string;
                channel: string;
                reactions: Array<{
                    role?: string;
                    unit?: string;
                    emoji: string;
                }>
            }>
        },
        messageRoles: {
            channel: string;
            roles: {
                [key: string]: {
                    role?: string;
                    unit?: string;
                }
            }
        }
    }
}
