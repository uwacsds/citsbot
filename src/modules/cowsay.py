import textwrap

line_max_len = 40
cow_art = \
'''
     \   ^__^
      \  (oo)\_______
         (__)\       )\/\\
             ||----w |
             ||     ||
'''

def normalize_text(msg):
    lines = textwrap.wrap(msg, line_max_len)
    maxlen = len(max(lines, key=len))
    return [line.ljust(maxlen) for line in lines]


def get_border(lines, index):
    if len(lines) < 2:
        return ['<', '>']
    elif index == 0:
        return ['/', '\\']
    elif index == len(lines) - 1:
        return ['\\', '/']
    else:
        return ['|', '|']


async def cowsay(msg):
    lines = normalize_text(msg.content)
    border_size = len(lines[0])
    bubble = ['  ' + '_' * border_size]
    for index, line in enumerate(lines):
        border = get_border(lines, index)
        bubble.append(f'{border[0]} {line} {border[1]}')
    bubble.append('  ' + '-' * border_size)
    await msg.channel.send('```\n' + '\n'.join(bubble) + cow_art + '\n```')


def commands():
    return {
        'cowsay': cowsay
    }
