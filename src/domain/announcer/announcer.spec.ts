import { AcademicCalendarService } from '../../academic-calendar/types';
import { BotActionType, BotEmbeddedMessageAction } from '../action-types';
import { AnnouncerConfig, announcerModule } from './announcer';

const mockCalendarService = (): AcademicCalendarService => ({
  fetchCalendar: async () => ({
    weeks: {
      ['2020-02-24T00:00:00.000Z']: {
        type: 'teaching',
        week: 1,
        semester: 1,
        date: new Date('2020-02-24T00:00:00.000Z'),
      },
      ['2020-03-02T00:00:00.000Z']: {
        type: 'teaching',
        week: 2,
        semester: 1,
        date: new Date('2020-03-02T00:00:00.000Z'),
      },
      ['2020-03-09T00:00:00.000Z']: {
        type: 'teaching',
        week: 3,
        semester: 1,
        date: new Date('2020-03-09T00:00:00.000Z'),
      },
      ['2020-03-16T00:00:00.000Z']: {
        type: 'teaching',
        week: 4,
        semester: 1,
        date: new Date('2020-03-16T00:00:00.000Z'),
      },
      ['2020-03-23T00:00:00.000Z']: {
        type: 'teaching',
        week: 5,
        semester: 1,
        date: new Date('2020-03-23T00:00:00.000Z'),
      },
      ['2020-03-30T00:00:00.000Z']: {
        type: 'teaching',
        week: 6,
        semester: 1,
        date: new Date('2020-03-30T00:00:00.000Z'),
      },
      ['2020-04-06T00:00:00.000Z']: {
        date: new Date('2020-04-06T00:00:00.000Z'),
        type: 'study-break',
      },
      ['2020-04-13T00:00:00.000Z']: {
        date: new Date('2020-04-13T00:00:00.000Z'),
        type: 'study-break',
      },
      ['2020-04-20T00:00:00.000Z']: {
        type: 'teaching',
        week: 7,
        semester: 1,
        date: new Date('2020-04-20T00:00:00.000Z'),
      },
      ['2020-04-27T00:00:00.000Z']: {
        type: 'teaching',
        week: 8,
        semester: 1,
        date: new Date('2020-04-27T00:00:00.000Z'),
      },
      ['2020-05-04T00:00:00.000Z']: {
        type: 'teaching',
        week: 9,
        semester: 1,
        date: new Date('2020-05-04T00:00:00.000Z'),
      },
      ['2020-05-11T00:00:00.000Z']: {
        type: 'teaching',
        week: 10,
        semester: 1,
        date: new Date('2020-05-11T00:00:00.000Z'),
      },
      ['2020-05-18T00:00:00.000Z']: {
        type: 'teaching',
        week: 11,
        semester: 1,
        date: new Date('2020-05-18T00:00:00.000Z'),
      },
      ['2020-05-25T00:00:00.000Z']: {
        type: 'teaching',
        week: 12,
        semester: 1,
        date: new Date('2020-05-25T00:00:00.000Z'),
      },
      ['2020-06-01T00:00:00.000Z']: {
        date: new Date('2020-06-01T00:00:00.000Z'),
        type: 'study-break',
      },
      ['2020-06-08T00:00:00.000Z']: {
        date: new Date('2020-06-08T00:00:00.000Z'),
        type: 'exam',
      },
      ['2020-06-15T00:00:00.000Z']: {
        date: new Date('2020-06-15T00:00:00.000Z'),
        type: 'exam',
      },
      ['2020-07-27T00:00:00.000Z']: {
        type: 'teaching',
        week: 1,
        semester: 2,
        date: new Date('2020-07-27T00:00:00.000Z'),
      },
      ['2020-08-03T00:00:00.000Z']: {
        type: 'teaching',
        week: 2,
        semester: 2,
        date: new Date('2020-08-03T00:00:00.000Z'),
      },
      ['2020-08-10T00:00:00.000Z']: {
        type: 'teaching',
        week: 3,
        semester: 2,
        date: new Date('2020-08-10T00:00:00.000Z'),
      },
      ['2020-08-17T00:00:00.000Z']: {
        type: 'teaching',
        week: 4,
        semester: 2,
        date: new Date('2020-08-17T00:00:00.000Z'),
      },
      ['2020-08-24T00:00:00.000Z']: {
        type: 'teaching',
        week: 5,
        semester: 2,
        date: new Date('2020-08-24T00:00:00.000Z'),
      },
      ['2020-08-31T00:00:00.000Z']: {
        type: 'teaching',
        week: 6,
        semester: 2,
        date: new Date('2020-08-31T00:00:00.000Z'),
      },
      ['2020-09-07T00:00:00.000Z']: {
        type: 'teaching',
        week: 7,
        semester: 2,
        date: new Date('2020-09-07T00:00:00.000Z'),
      },
      ['2020-09-14T00:00:00.000Z']: {
        type: 'teaching',
        week: 8,
        semester: 2,
        date: new Date('2020-09-14T00:00:00.000Z'),
      },
      ['2020-09-21T00:00:00.000Z']: {
        type: 'teaching',
        week: 9,
        semester: 2,
        date: new Date('2020-09-21T00:00:00.000Z'),
      },
      ['2020-09-28T00:00:00.000Z']: {
        date: new Date('2020-09-28T00:00:00.000Z'),
        type: 'study-break',
      },
      ['2020-10-05T00:00:00.000Z']: {
        type: 'teaching',
        week: 10,
        semester: 2,
        date: new Date('2020-10-05T00:00:00.000Z'),
      },
      ['2020-10-12T00:00:00.000Z']: {
        type: 'teaching',
        week: 11,
        semester: 2,
        date: new Date('2020-10-12T00:00:00.000Z'),
      },
      ['2020-10-19T00:00:00.000Z']: {
        type: 'teaching',
        week: 12,
        semester: 2,
        date: new Date('2020-10-19T00:00:00.000Z'),
      },
      ['2020-10-26T00:00:00.000Z']: {
        date: new Date('2020-10-26T00:00:00.000Z'),
        type: 'study-break',
      },
      ['2020-11-02T00:00:00.000Z']: {
        date: new Date('2020-11-02T00:00:00.000Z'),
        type: 'exam',
      },
      ['2020-11-09T00:00:00.000Z']: {
        date: new Date('2020-11-09T00:00:00.000Z'),
        type: 'exam',
      },
    },
  }),
});

describe('announcer-module', () => {
  const config: AnnouncerConfig = {
    channel: 'ch_1234',
    colour: 'red',
    crontab: '* * * * *',
    disclaimer: 'test disclaimer',
    image: 'banner.png',
  };
  const announcer = announcerModule(config, mockCalendarService());

  it('should announce a standard teaching week with no deadlines', async () => {
    const message = await announcer.announce(() => new Date('2020-03-02T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Week 2 of Semester 1',
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
    const message = await announcer.announce(() => new Date('2020-03-06T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Welcome to Week 2 of Semester 1',
        fields: [],
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    });
  });

  it('should announce a study break', async () => {
    const message = await announcer.announce(() => new Date('2020-10-27T00:00:00.000Z'));
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

  it('should announce an exam week', async () => {
    const message = await announcer.announce(() => new Date('2020-11-11T00:00:00.000Z'));
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

  it('should announce a summer vacation and describe the number of weeks until the next semester', async () => {
    const message = await announcer.announce(() => new Date('2020-06-22T00:00:00.000Z'));
    expect(message).toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Winter Vacation',
        description:
          '📅 5 weeks left until next semester\n\n📝 Enrolment details: https://www.uwa.edu.au/students/my-course/enrolment',
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
