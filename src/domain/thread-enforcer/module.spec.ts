import { DiscordMessage } from '../../discord/types';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { ThreadEnforcerConfig } from './config';
import { threadEnforcerModule } from './module';

describe(`thread enforcer module`, () => {
  const now = () => new Date(`2020-01-01`);

  const config: ThreadEnforcerConfig = {
    channels: [
      { channelId: `channel-123`, channelName: `#project-showcase`, topicPlural: `projects`, topicSingular: `project` },
      { channelId: `channel-345`, channelName: `#job-opportunities`, topicPlural: `job opportunities`, topicSingular: `job opportunity` },
    ],
    ruleBreakDm: `{username}, {username}, {channelName}, {channelName}, {topicPlural}, {topicPlural}, {topicSingular}, {topicSingular}`,
  };

  const message: DiscordMessage = {
    id: `1`, createdAt: now(), deletable: true, content: ``, attachments: [], 
    author: { avatar: `avatar1`, bot: false, createdAt: now(), discriminator: `discriminator1`, id: `user1`, tag: `tag1`, username: `user1` },
    channel: { createdAt: now(), type: `text`, id: `channel-123` },
  };
  
  const emitter = { messageDeleted: jest.fn() };

  const threadChannelEnforcer = threadEnforcerModule(mockLogger(), emitter, config);

  beforeEach(() => jest.resetAllMocks());

  test(`given channel not configured > when message > should dispatch no actions`, async () => {
    await expect(threadChannelEnforcer.onMessage({
      ...message,
      channel: { ...message.channel, id: `channel-234` },
    })).resolves.toEqual([]);
  });

  test(`given channel configured, but message contains url > when message > should dispatch no actions`, async () => {
    await expect(threadChannelEnforcer.onMessage({
      ...message,
      content: `Check out my cool project https://github.com/uwacsds/citsbot`,
      channel: { ...message.channel, id: `channel-123` },
    })).resolves.toEqual([]);
  });

  test(`given channel configured, message does not contain url > when message > should dispatch expected remove message and direct message actions, and emit metric`, async () => {
    await expect(threadChannelEnforcer.onMessage({
      ...message,
      content: `Nice project`,
      channel: { ...message.channel, id: `channel-123` },
    })).resolves.toEqual([
      {
        type: BotActionType.RemoveMessage,
        channelId: message.channel.id,
        messageId: message.id,
      },
      {
        type: BotActionType.DirectMessage,
        userId: message.author.id,
        messageContent: `user1, user1, #project-showcase, #project-showcase, projects, projects, project, project`,
      },
    ]);
    expect(emitter.messageDeleted).toHaveBeenCalledWith(`#project-showcase`);
  });
});
