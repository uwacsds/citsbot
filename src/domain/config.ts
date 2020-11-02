import { promises as fs } from 'fs';
import { CowsayConfig } from './cowsay/cowsay';
import { ReactRolesConfig } from './react-roles/react-roles';
import { WelcomerConfig } from './welcomer/welcomer';

export interface UnitsConfig {
    [key: string]: {
        name: string;
        role: string;
        channels: {
            general: string;
            resources: string;
        }
    }
}

export interface BotConfig {
    prefix: string;
    guild: string;
    logChannel: string;
    units: UnitsConfig,
    modules: {
        cowsay: CowsayConfig,
        welcomer: WelcomerConfig,
        announcer: {
            channel: string;
            crontab: string;
        },
        reactRoles: ReactRolesConfig,
    }
}

export const loadConfig = async (path: string): Promise<BotConfig> =>
    JSON.parse(await fs.readFile(path, { encoding: 'utf-8' }));
