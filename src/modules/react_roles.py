import discord
import discord.ext.commands as commands
import discord.utils


class ReactRolesMessageReactionConfig:
    def __init__(self, react_cfg, units):
        self.emoji = react_cfg["emoji"]

        if "role" in react_cfg:
            self.role = react_cfg["role"]
        elif "unit" in react_cfg:
            unit_id = react_cfg["unit"]
            self.role = units[unit_id]["role"]
        else:
            raise AttributeError(f"No role ID specified in config file for role with emoji {self.emoji}")


class ReactRolesMessageConfig:
    def __init__(self, msg_cfg, units):
        self.id = msg_cfg["id"]
        self.channel = msg_cfg["channel"]
        self.reactions = []
        for react_cfg in msg_cfg["reactions"]:
            self.reactions.append(ReactRolesMessageReactionConfig(react_cfg, units))


class ReactRolesConfig:
    def __init__(self, cfg):
        try:
            mod = cfg["modules"]["react_roles"]
            self.guild = cfg["guild"]
            self.messages = []
            for msg_cfg in mod["messages"]:
                self.messages.append(ReactRolesMessageConfig(msg_cfg, cfg["units"]))
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class ReactRoles(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = ReactRolesConfig(cfg)
        self.watching = {}

    def get_emoji(self, name):
        # try get a custom emoji first
        emoji = discord.utils.get(self.bot.emojis, name=name)
        if emoji:
            return emoji
        return name  # default to unicode

    async def setup_react(self, msg, cfg_react):
        emoji = self.get_emoji(name=cfg_react.emoji)
        await msg.add_reaction(emoji)

    async def setup_msg(self, cfg_msg):
        msg = await self.bot.get_channel(cfg_msg.channel).fetch_message(cfg_msg.id)
        for cfg_react in cfg_msg.reactions:
            await self.setup_react(msg, cfg_react)

    @commands.Cog.listener()
    async def on_ready(self):
        for cfg_msg in self.cfg.messages:
            await self.setup_msg(cfg_msg)

    async def add_role(self, cfg_msg, emoji, member) -> bool:
        for cfg_react in cfg_msg.reactions:
            if cfg_react.emoji == emoji.name:
                role = self.bot.get_guild(self.cfg.guild).get_role(cfg_react.role)
                await member.add_roles(role)
                return True
        return False

    async def remove_react(self, cfg_msg, emoji: discord.PartialEmoji, member: discord.Member):
        msg = await self.bot.get_channel(cfg_msg.channel).fetch_message(cfg_msg.id)
        await msg.remove_reaction(emoji, member)

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload: discord.RawReactionActionEvent):
        if payload.user_id == self.bot.user.id:
            return
        for cfg_msg in self.cfg.messages:
            if cfg_msg.id == payload.message_id:
                role_added = await self.add_role(cfg_msg, payload.emoji, payload.member)
                if not role_added:  # remove the react if there is no associated role
                    await self.remove_react(cfg_msg, payload.emoji, payload.member)

    async def remove_role(self, cfg_msg, emoji, member):
        for cfg_react in cfg_msg.reactions:
            if cfg_react.emoji == emoji.name:
                role = self.bot.get_guild(self.cfg.guild).get_role(cfg_react.role)
                await member.remove_roles(role)

    @commands.Cog.listener()
    async def on_raw_reaction_remove(self, payload):
        if payload.user_id == self.bot.user.id:
            return

        for cfg_msg in self.cfg.messages:
            if cfg_msg.id == payload.message_id:
                member = self.bot.get_guild(self.cfg.guild).get_member(payload.user_id)
                await self.remove_role(cfg_msg, payload.emoji, member)
