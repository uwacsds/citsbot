import { AcademicCalendarService } from './calendar/types';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { AnnouncerConfig, announcerModule } from './module';

const mockCalendarService = (): AcademicCalendarService => async () => ({
  weeks: {
    ['2020-02-24']: {
      type: 'teaching',
      week: 1,
      semester: 1,
      date: new Date('2020-02-24T00:00:00.000Z'),
      deadlines: [],
    },
    ['2020-03-02']: {
      type: 'teaching',
      week: 2,
      semester: 1,
      date: new Date('2020-03-02T00:00:00.000Z'),
      deadlines: [{ unit: 'TEST1001', title: 'Test 1', date: new Date('2020-03-03T23:59:00.000+08:00') }],
    },
    ['2020-03-09']: {
      type: 'study-break',
      date: new Date('2020-03-09T00:00:00.000Z'),
      deadlines: [],
    },
    ['2020-03-16']: {
      type: 'exam',
      date: new Date('2020-03-16T00:00:00..000Z'),
      deadlines: [],
    },
    ['2020-07-27']: {
      type: 'teaching',
      week: 1,
      semester: 2,
      date: new Date('2020-07-27T00:00:00.000Z'),
      deadlines: [],
    },
    ['2020-08-03']: {
      type: 'teaching',
      date: new Date('2020-08-03T00:00:00.000Z'),
      week: 2,
      semester: 2,
      deadlines: [{ unit: 'TEST2002', title: 'Test 2', date: new Date('2020-08-05T12:54:00.000+08:00') }],
    },
    ['2020-08-10']: {
      type: 'study-break',
      date: new Date('2020-08-10T00:00:00.000Z'),
      deadlines: [],
    },
    ['2020-08-17']: {
      type: 'exam',
      date: new Date('2020-08-17T00:00:00.000Z'),
      deadlines: [],
    },
  },
});

describe('announcer-module', () => {
  const config: AnnouncerConfig = {
    channel: 'ch_1234',
    colour: 'red',
    crontab: '* * * * *',
    disclaimer: 'test disclaimer',
    image: 'banner.png',
  };
  const announcer = announcerModule(config, mockLogger(), mockCalendarService());

  it('should announce a standard teaching week with no deadlines', async () => {
    const message = await announcer.announce(() => new Date('2020-02-24T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Week 1 of Semester 1',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce the correct week when given a date that is not exactly monday', async () => {
    const message = await announcer.announce(() => new Date('2020-02-28T13:46:12.881Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Week 1 of Semester 1',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a semester 1 study break', async () => {
    const message = await announcer.announce(() => new Date('2020-03-09T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Semester 1 Study Break',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a semester 2 study break', async () => {
    const message = await announcer.announce(() => new Date('2020-08-10T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Semester 2 Study Break',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a semester 1 exam week', async () => {
    const message = await announcer.announce(() => new Date('2020-03-16T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Semester 1 Exams',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a semester 2 exam week', async () => {
    const message = await announcer.announce(() => new Date('2020-08-17T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Semester 2 Exams',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a winter vacation and describe the number of weeks until the next semester', async () => {
    const message = await announcer.announce(() => new Date('2020-06-22T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Winter Vacation',
        description: '📅 5 weeks left until next semester\n\n📝 Enrolment details: https://www.uwa.edu.au/students/my-course/enrolment',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a summer vacation and describe the number of weeks until the next semester', async () => {
    const message = await announcer.announce(() => new Date('2020-12-24T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Summer Vacation',
        description: '📅 9 weeks left until next semester\n\n📝 Enrolment details: https://www.uwa.edu.au/students/my-course/enrolment',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });
});
