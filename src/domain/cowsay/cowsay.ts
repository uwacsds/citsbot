import { LoggingService } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { BotConfig } from '../config';
import { CowsayModule, ModuleType } from '../module-types';

export interface CowsayConfig {
  lineMaxLen: number;
  cowArt: string;
}

const wrapText = (text: string, maxLineLen: number) => {
  const words = text.split(' ').reverse();
  const completeLines = [];
  let currentLine = '';
  while (words.length > 0) {
    const nextWord = words.pop();
    if (`${currentLine} ${nextWord}`.length > maxLineLen) {
      completeLines.push(currentLine.trim());
      currentLine = '';
    }
    currentLine = `${currentLine} ${nextWord}`;
  }
  completeLines.push(currentLine.trim());
  return completeLines;
};

const getBorder = (lineCount: number, lineNumber: number) => {
  if (lineCount < 2) return ['<', '>'];
  if (lineNumber == 0) return ['/', '\\'];
  if (lineNumber == lineCount - 1) return ['\\', '/'];
  return ['|', '|'];
};

export const cowsayModule = (config: BotConfig, { log }: LoggingService): CowsayModule => {
  const formatMessage = (message: string): string => {
    const sanitizedMessage = message.replace(/`/g, "'");
    const lines = wrapText(sanitizedMessage, config.modules.cowsay.lineMaxLen);
    let maxLineLen = -1;
    lines.forEach((line) => {
      if (line.length > maxLineLen) maxLineLen = line.length;
    });
    const borderSize = lines.length > 1 ? maxLineLen : lines[0].length;

    const bubble = ['  ' + '_'.repeat(borderSize)];
    lines.forEach((line, idx) => {
      const [borderLeft, borderRight] = getBorder(lines.length, idx);
      bubble.push(`${borderLeft} ${line.padEnd(borderSize)} ${borderRight}`);
    });
    bubble.push('  ' + '-'.repeat(borderSize));

    log('info', 'Formatted cowsay', { title: 'Cowsay', data: { message } });
    return `\`\`\`\n${bubble.join('\n')}${config.modules.cowsay.cowArt}\n\`\`\``;
  };

  return {
    type: ModuleType.Cowsay,
    onMessage: async (message) => {
      const prefix = `${config.prefix}cowsay `;
      if (message.content.startsWith(prefix)) return { type: BotActionType.Message, channelId: message.channel.id, messageContent: formatMessage(message.content.slice(prefix.length)) };
      return { type: BotActionType.Nothing };
    },
  };
};
