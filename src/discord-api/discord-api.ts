import {
  Channel,
  Client,
  GuildEmoji,
  Message,
  MessageEmbed,
  MessageReaction,
  PartialUser,
  ReactionEmoji,
  TextChannel,
  User,
} from 'discord.js';
import {
  BotAction,
  BotActionType,
  BotAddReactionAction,
  BotEmbeddedMessageAction,
  BotMessageAction,
  BotRoleGrantAction,
  BotRoleRevokeAction,
} from '../domain/action-types';
import {
  DiscordChannel,
  DiscordCommandHandler,
  DiscordEmoji,
  DiscordMessage,
  DiscordReaction,
  DiscordUser,
} from '../domain/discord-types';
import { DiscordAPI, MessageTuple } from './types';

const parseUser = (user: User | PartialUser): DiscordUser => ({
  id: user.id,
  avatar: user.displayAvatarURL(),
  bot: user.bot,
  createdAt: user.createdAt,
  discriminator: user.discriminator,
  username: user.username,
  tag: user.tag,
});

const parseChannel = (channel: Channel): DiscordChannel => ({
  createdAt: channel.createdAt,
  id: channel.id,
  type: channel.type,
});

const parseMessage = (msg: Message): DiscordMessage => ({
  author: parseUser(msg.author),
  channel: parseChannel(msg.channel),
  content: msg.content,
  createdAt: msg.createdAt,
  deletable: msg.deletable,
  id: msg.id,
});

const parseEmoji = (emoji: GuildEmoji | ReactionEmoji): DiscordEmoji => ({
  name: emoji.name,
});

const parseReaction = (reaction: MessageReaction): DiscordReaction => ({
  count: reaction.count || 0,
  message: parseMessage(reaction.message),
  emoji: parseEmoji(reaction.emoji),
});

const fetchChannel = async (client: Client, id: string): Promise<Channel | null> => client.channels.fetch(id);

const fetchTextChannel = async (client: Client, id: string): Promise<TextChannel | null> => {
  const channel = await fetchChannel(client, id);
  if (channel?.type !== 'text') return null;
  return channel as TextChannel;
};

const fetchMessage = async (client: Client, channelId: string, messageId: string): Promise<Message | null> => {
  const channel = await fetchTextChannel(client, channelId);
  const message = await channel?.messages.fetch(messageId);
  if (!message) return null;
  return message;
};

const fetchMember = async (client: Client, guildId: string, userId: string) => {
  const guild = await client.guilds.fetch(guildId);
  return guild.members.fetch(userId);
};

const applyMessage = async (client: Client, action: BotMessageAction) => {
  const channel = await fetchTextChannel(client, action.channelId);
  if (!channel) return;
  await channel.send(action.messageContent);
};

const applyEmbeddedMessage = async (client: Client, action: BotEmbeddedMessageAction) => {
  const channel = await fetchTextChannel(client, action.channelId);
  if (!channel) return;

  const embed = new MessageEmbed();
  if (action.embed.colour) embed.setColor(action.embed.colour);
  if (action.embed.description) embed.setDescription(action.embed.description);
  if (action.embed.fields) embed.addFields(action.embed.fields);
  if (action.embed.image) embed.setImage(action.embed.image);
  if (action.embed.thumbnail) embed.setThumbnail(action.embed.thumbnail);
  if (action.embed.timestamp) embed.setTimestamp(action.embed.timestamp);
  if (action.embed.title) embed.setTitle(action.embed.title);
  if (action.embed.url) embed.setURL(action.embed.url);
  if (action.embed.author) {
    const { name, iconsUrl, url } = action.embed.author;
    embed.setAuthor(name, iconsUrl, url);
  }
  if (action.embed.footer) {
    const { text, iconUrl } = action.embed.footer;
    embed.setFooter(text, iconUrl);
  }

  await channel.send(embed);
};

const applyAddReaction = async (client: Client, action: BotAddReactionAction) => {
  const message = await fetchMessage(client, action.channelId, action.messageId);
  await message?.react(action.emoji);
};

const applyRoleGrant = async (client: Client, action: BotRoleGrantAction) => {
  const member = await fetchMember(client, action.guild, action.user.id);
  await member.roles.add(action.role);
};

const applyRoleRevoke = async (client: Client, action: BotRoleRevokeAction) => {
  const member = await fetchMember(client, action.guild, action.user.id);
  await member.roles.remove(action.role);
};

const applyAction = (client: Client, action: BotAction) => {
  switch (action.type) {
    case BotActionType.Message:
      return applyMessage(client, action);
    case BotActionType.EmbeddedMessage:
      return applyEmbeddedMessage(client, action);
    case BotActionType.AddReaction:
      return applyAddReaction(client, action);
    case BotActionType.RoleGrant:
      return applyRoleGrant(client, action);
    case BotActionType.RoleRevoke:
      return applyRoleRevoke(client, action);
  }
};

export const discordApi = (
  { onMessage, onMemberJoin, onReactionAdd, onReactionRemove }: DiscordCommandHandler,
  messagesToCache: MessageTuple[]
): DiscordAPI => {
  const client = new Client({
    ws: {
      intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    }
  });

  client.on('message', async (msg) => {
    applyAction(client, await onMessage(parseMessage(msg)));
  });
  client.on('guildMemberAdd', async (member) => {
    if (!member.user) return;
    applyAction(client, await onMemberJoin(parseUser(member.user)));
  });
  client.on('messageReactionAdd', async (reaction, user) => {
    applyAction(client, await onReactionAdd(parseReaction(reaction), parseUser(user)));
  });
  client.on('messageReactionRemove', async (reaction, user) => {
    applyAction(client, await onReactionRemove(parseReaction(reaction), parseUser(user)));
  });

  return {
    start: async (discordToken: string) => {
      await client.login(discordToken);
      await Promise.all(messagesToCache.map(([channelId, messageId]) => fetchMessage(client, channelId, messageId)));
      console.log('Ready');
    },
    stop: async () => client.destroy(),
  };
};
