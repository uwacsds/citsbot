import { Channel, Message, Client, TextChannel } from 'discord.js';
import { DiscordAPI } from './types';

const fetchChannel = (client: Client) => async (id: string): Promise<Channel | undefined> => client.channels.fetch(id);

const fetchTextChannel = (client: Client) => async (id: string): Promise<TextChannel | undefined> => {
  const channel = await fetchChannel(client)(id);
  if (channel?.type !== 'text') return undefined;
  return channel as TextChannel;
};

const fetchMessage = (client: Client) => async (channelId: string, messageId: string): Promise<Message | undefined> => {
  const channel = await fetchTextChannel(client)(channelId);
  const message = await channel?.messages.fetch(messageId);
  if (!message) return undefined;
  return message;
};

const fetchMember = (client: Client, guildId: string) => async (userId: string) => {
  const guild = await client.guilds.fetch(guildId);
  return guild.members.fetch(userId);
};

export const discordApi = (client: Client, guildId: string): DiscordAPI => ({
  fetchChannel: fetchChannel(client),
  fetchMember: fetchMember(client, guildId),
  fetchMessage: fetchMessage(client),
  fetchTextChannel: fetchTextChannel(client),
});
