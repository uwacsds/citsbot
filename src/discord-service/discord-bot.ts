import { Channel, Client, GuildEmoji, Message, MessageAttachment, MessageEmbed, MessageReaction, PartialUser, ReactionEmoji, User } from 'discord.js';
import {
  BotAction,
  BotActionType,
  BotAddReactionAction,
  BotCacheMessageAction,
  BotDirectMessageAction,
  BotEmbeddedMessageAction,
  BotMessageAction,
  BotRemoveMessageAction,
  BotRemoveReactionAction,
  BotRoleGrantAction,
  BotRoleRevokeAction,
} from '../domain/action-types';
import { DiscordCommandHandler } from '../domain/command-handler';
import { discordEmitter, DiscordEmitter } from './metrics';
import { LoggingService } from '../utils/logging';
import { discordApi } from './discord-api';
import { DiscordBot, DiscordAPI, DiscordChannel, DiscordEmoji, DiscordMessage, DiscordMessageAttachment, DiscordReaction, DiscordUser } from './types';

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

const parseAttachment = (attachment: MessageAttachment): DiscordMessageAttachment => ({
  id: attachment.id,
  url: attachment.url,
  width: attachment.width,
  height: attachment.height,
  size: attachment.size,
});

const parseMessage = (message: Message): DiscordMessage => ({
  author: parseUser(message.author),
  channel: parseChannel(message.channel),
  content: message.content,
  createdAt: message.createdAt,
  deletable: message.deletable,
  id: message.id,
  attachments: message.attachments.map(parseAttachment),
});

const parseEmoji = ({ id, name }: GuildEmoji | ReactionEmoji): DiscordEmoji => ({ id: id ?? name, name });

const parseReaction = (reaction: MessageReaction): DiscordReaction => ({
  count: reaction.count ?? 0,
  message: parseMessage(reaction.message),
  emoji: parseEmoji(reaction.emoji),
});

const applyMessage = async ({ fetchTextChannel }: DiscordAPI, { channelId, messageContent }: BotMessageAction) => {
  const channel = await fetchTextChannel(channelId);
  if (!channel) return;
  await channel.send(messageContent);
};

const applyEmbeddedMessage = async ({ fetchTextChannel }: DiscordAPI, action: BotEmbeddedMessageAction) => {
  const channel = await fetchTextChannel(action.channelId);
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

const applyAddReaction = async ({ fetchMessage }: DiscordAPI, action: BotAddReactionAction) => {
  const message = await fetchMessage(action.channelId, action.messageId);
  const guildEmoji = message?.guild?.emojis.cache.find(emoji => emoji.name === action.emoji);
  if (guildEmoji) await message?.react(guildEmoji);
  else await message?.react(action.emoji);
};

const applyRemoveReaction = async ({ fetchMessage }: DiscordAPI, action: BotRemoveReactionAction) => {
  const message = await fetchMessage(action.channelId, action.messageId);
  await message?.reactions.cache.get(action.reactionId)?.remove();
};

const applyRoleGrant = async ({ fetchMember }: DiscordAPI, action: BotRoleGrantAction) => {
  const member = await fetchMember(action.user.id);
  await member.roles.add(action.role);
};

const applyRoleRevoke = async ({ fetchMember }: DiscordAPI, action: BotRoleRevokeAction) => {
  const member = await fetchMember(action.user.id);
  await member.roles.remove(action.role);
};

const applyRemoveMessage = async ({ fetchTextChannel }: DiscordAPI, { messageId, channelId }: BotRemoveMessageAction) => {
  const channel = await fetchTextChannel(channelId);
  await channel?.messages.delete(messageId);
};

const applyDirectMessage = async ({ fetchMember }: DiscordAPI, { userId, messageContent }: BotDirectMessageAction) => {
  const member = await fetchMember(userId);
  if (!member) return;
  await member.send(messageContent);
};

const applyCacheMessage = async ({ fetchMessage }: DiscordAPI, { messageId, channelId }: BotCacheMessageAction) => fetchMessage(channelId, messageId);

const applyAction = (emit: DiscordEmitter, fetchApi: DiscordAPI, action: BotAction) => {
  const delay = action.delay ?? 0;
  const condition = action.condition ?? (() => true);

  setTimeout(() => {
    if (!condition(fetchApi)) return;
    emit.action(action.type);
    switch (action.type) {
      case BotActionType.Message:
        return applyMessage(fetchApi, action);
      case BotActionType.EmbeddedMessage:
        return applyEmbeddedMessage(fetchApi, action);
      case BotActionType.AddReaction:
        return applyAddReaction(fetchApi, action);
      case BotActionType.RemoveReaction:
        return applyRemoveReaction(fetchApi, action);
      case BotActionType.RoleGrant:
        return applyRoleGrant(fetchApi, action);
      case BotActionType.RoleRevoke:
        return applyRoleRevoke(fetchApi, action);
      case BotActionType.RemoveMessage:
        return applyRemoveMessage(fetchApi, action);
      case BotActionType.DirectMessage:
        return applyDirectMessage(fetchApi, action);
      case BotActionType.CacheMessage:
        return applyCacheMessage(fetchApi, action);
    }
  }, delay);
};

export const discordBot = (
  logger: LoggingService,
  { registerEventListener, onBotStart, onMessage, onMemberJoin, onReactionAdd, onReactionRemove }: DiscordCommandHandler,
  guildId: string
): DiscordBot => {
  const emit = discordEmitter();
  const client = new Client({
    ws: {
      intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES'],
    },
  });
  const fetchApi = discordApi(client, guildId);

  registerEventListener(action => applyAction(emit, fetchApi, action));

  registerMetrics(client, logger, emit, guildId);

  client.on('ready', async () => {
    const guild = client.guilds.cache.get(guildId);
    await guild?.fetchBans();
    await guild?.members.fetch();

    const actions = await Promise.all(onBotStart());
    for (const action of actions.flat()) {
      logger.log('info', 'Applying Action', { title: 'OnReady', data: action });
      await applyAction(emit, fetchApi, action);
    }
  });
  client.on('message', async message => {
    if (message.guild?.id !== guildId) return;
    const actions = await Promise.all(onMessage(parseMessage(message)));
    for (const action of actions.flat()) {
      logger.log('info', 'Applying Action', { title: 'OnMessage', data: action });
      await applyAction(emit, fetchApi, action);
    }
  });
  client.on('guildMemberAdd', async member => {
    if (!member.user || member.guild.id !== guildId) return;
    const actions = await Promise.all(onMemberJoin(parseUser(member.user)));
    for (const action of actions.flat()) {
      logger.log('info', 'Applying Action', { title: 'OnGuildMemberAdd', data: action });
      await applyAction(emit, fetchApi, action);
    }
  });
  client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.guild?.id !== guildId) return;
    const actions = await Promise.all(onReactionAdd(parseReaction(reaction), parseUser(user)));
    for (const action of actions.flat()) {
      logger.log('info', 'Applying Action', { title: 'OnMessageReactionAdd', data: action });
      await applyAction(emit, fetchApi, action);
    }
  });
  client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.guild?.id !== guildId) return;
    const actions = await Promise.all(onReactionRemove(parseReaction(reaction), parseUser(user)));
    for (const action of actions.flat()) {
      logger.log('info', 'Applying Action', { title: 'OnMessageReactionRemove', data: action });
      await applyAction(emit, fetchApi, action);
    }
  });

  return {
    applyAction: async action => applyAction(emit, fetchApi, action),
    start: async (discordToken: string) => {
      await client.login(discordToken);
    },
    stop: async () => client.destroy(),
  };
};

const registerMetrics = (client: Client, logger: LoggingService, emit: DiscordEmitter, guildId: string) => {
  clientEvents.forEach(event => client.addListener(event, () => emit.event(event)));

  client.on('message', message => {
    if (message.guild?.id !== guildId) return;
    const channelName = message.guild.channels.cache.get(message.channel.id)?.name ?? 'UNKNOWN';
    emit.message(channelName);
    const parsedMessage = parseMessage(message) as DiscordMessage & { channel: { name: string } };
    parsedMessage.channel.name = channelName;
    logger.log('info', 'client.on.message', { data: { ...parsedMessage } });
  });

  client.setInterval(() => {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;
    emit.memberCount(guild.name, guild.memberCount);
    emit.memberOnlineCount(guild.name, guild.members.cache.filter(member => member.presence.status !== 'offline').size);
  }, 30_000);
};

const clientEvents = [
  'channelCreate',
  'channelDelete',
  'channelPinsUpdate',
  'channelUpdate',
  'debug',
  'emojiCreate',
  'emojiDelete',
  'emojiUpdate',
  'error',
  'guildBanAdd',
  'guildBanRemove',
  'guildCreate',
  'guildDelete',
  'guildIntegrationsUpdate',
  'guildMemberAdd',
  'guildMemberAvailable',
  'guildMemberRemove',
  'guildMembersChunk',
  'guildMemberSpeaking',
  'guildMemberUpdate',
  'guildUnavailable',
  'guildUpdate',
  'invalidated',
  'inviteCreate',
  'inviteDelete',
  'message',
  'messageDelete',
  'messageDeleteBulk',
  'messageReactionAdd',
  'messageReactionRemove',
  'messageReactionRemoveAll',
  'messageReactionRemoveEmoji',
  'messageUpdate',
  'presenceUpdate',
  'rateLimit',
  'ready',
  'roleCreate',
  'roleDelete',
  'roleUpdate',
  'shardDisconnect',
  'shardError',
  'shardReady',
  'shardReconnecting',
  'shardResume',
  'typingStart',
  'userUpdate',
  'voiceStateUpdate',
  'warn',
  'webhookUpdate',
];
