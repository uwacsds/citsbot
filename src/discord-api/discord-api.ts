import {
  Channel,
  Client,
  GuildEmoji,
  Message,
  MessageAttachment,
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
  BotRemoveMessageAction,
  BotRoleGrantAction,
  BotRoleRevokeAction,
} from '../domain/action-types';
import {
  DiscordChannel,
  DiscordCommandHandler,
  DiscordEmoji,
  DiscordMessage,
  DiscordMessageAttachment,
  DiscordReaction,
  DiscordUser,
} from '../domain/discord-types';
import { LoggingService } from '../utils/logging';
import { DiscordAPI, MessageTuple } from './types';

const parseUser = ({ id, displayAvatarURL, bot, createdAt, discriminator, username, tag }: User | PartialUser): DiscordUser => ({
  id,
  avatar: displayAvatarURL(),
  bot,
  createdAt,
  discriminator,
  username,
  tag,
});

const parseChannel = ({ createdAt, id, type }: Channel): DiscordChannel => ({
  createdAt,
  id,
  type,
});

const parseAttachment = ({ id, url, width, height, size }: MessageAttachment): DiscordMessageAttachment => ({
  id,
  url,
  width,
  height,
  size,
});

const parseMessage = ({ author, channel, content, createdAt, deletable, id, attachments }: Message): DiscordMessage => ({
  author: parseUser(author),
  channel: parseChannel(channel),
  content,
  createdAt,
  deletable,
  id,
  attachments: attachments.map(parseAttachment),
});

const parseEmoji = ({ name }: GuildEmoji | ReactionEmoji): DiscordEmoji => ({
  name,
});

const parseReaction = ({ count, message, emoji}: MessageReaction): DiscordReaction => ({
  count: count ?? 0,
  message: parseMessage(message),
  emoji: parseEmoji(emoji),
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

const applyRemoveMessage = async (client: Client, { messageId, channelId }: BotRemoveMessageAction) => {
  const channel = await fetchTextChannel(client, channelId);
  await channel?.messages.delete(messageId);
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
    case BotActionType.RemoveMessage:
      return applyRemoveMessage(client, action);
  }
};

export const discordApi = (
  { log }: LoggingService,
  { registerEventListener, onMessage, onMemberJoin, onReactionAdd, onReactionRemove }: DiscordCommandHandler,
  messagesToCache: MessageTuple[]
): DiscordAPI => {
  const client = new Client({
    ws: {
      intents: [
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
      ],
    },
  });

  registerEventListener((action) => applyAction(client, action));

  const filterNothingActions = (actions: BotAction[]) => actions.filter(({ type }) => type !== BotActionType.Nothing);

  client.on('message', async (message) => {
    const actions = await Promise.all(onMessage(parseMessage(message)));
    for (const action of filterNothingActions(actions)) {
      log('info', 'Applying Action', { title: 'OnMessage', data: action });
      await applyAction(client, action);
    }
  });
  client.on('guildMemberAdd', async (member) => {
    if (!member.user) return;
    const actions = await Promise.all(onMemberJoin(parseUser(member.user)));
    for (const action of filterNothingActions(actions)) {
      log('info', 'Applying Action', { title: 'OnGuildMemberAdd', data: action });
      await applyAction(client, action);
    }
  });
  client.on('messageReactionAdd', async (reaction, user) => {
    const actions = await Promise.all(onReactionAdd(parseReaction(reaction), parseUser(user)));
    for (const action of filterNothingActions(actions)) {
      log('info', 'Applying Action', { title: 'OnMessageReactionAdd', data: action });
      await applyAction(client, action);
    }
  });
  client.on('messageReactionRemove', async (reaction, user) => {
    const actions = await Promise.all(onReactionRemove(parseReaction(reaction), parseUser(user)));
    for (const action of filterNothingActions(actions)) {
      log('info', 'Applying Action', { title: 'OnMessageReactionRemove', data: action });
      await applyAction(client, action);
    }
  });

  return {
    applyAction: async (action) => applyAction(client, action),
    start: async (discordToken: string) => {
      await client.login(discordToken);
      await Promise.all(messagesToCache.map(([channelId, messageId]) => fetchMessage(client, channelId, messageId)));
      console.log('Ready');
    },
    stop: async () => client.destroy(),
  };
};
