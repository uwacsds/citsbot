import discord
import discord.ext.commands as commands
import discord.utils


class MessageRolesConfig:
    def __init__(self, cfg):
        try:
            mod = cfg["modules"]["message_roles"]
            self.units = cfg["units"]
            self.guild = cfg["guild"]
            self.channel = mod["channel"]
            self.roles = mod["roles"]
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class MessageRoles(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.cfg = MessageRolesConfig(cfg)
        self.logger = logger

    @commands.group(name="role")
    async def role(self, ctx):
        if ctx.channel.id != self.cfg.channel:
            return
        if ctx.invoked_subcommand is None:
            await ctx.channel.send("Usage: `role <add|remove|clean> <role-list>`")

    async def ack_command(self, ctx):
        await ctx.message.add_reaction("✅")
        # await ctx.message.delete()

    async def get_generated_role(self, role_name):
        guild = self.bot.get_guild(self.cfg.guild)
        existing = discord.utils.get(guild.roles, name=role_name)
        if existing is None:
            print("Creating new role:", role_name)
            existing = await guild.create_role(name=role_name)
        self.cfg.roles[role_name] = existing.id

    def get_role(self, guild, role):
        cfg_role = self.cfg.roles[role]
        if "unit" in cfg_role:
            cfg_unit = self.cfg.units[cfg_role["unit"]]
            return guild.get_role(cfg_unit["role"])
        elif "role" in cfg_role:
            return guild.get_role(cfg_role["role"])

    @commands.Cog.listener()
    async def on_ready(self):
        for role_name, role_id in self.cfg.roles.items():
            if role_id is None:
                await self.get_generated_role(role_name)

    @role.command()
    async def add(self, ctx, *roles):
        if ctx.channel.id != self.cfg.channel:
            return
        if len(roles) <= 0:
            return await ctx.channel.send("No roles provided.")

        discord_roles = []
        for role in roles:
            try:
                discord_roles.append(self.get_role(ctx.guild, role))
            except KeyError as NotValid:
                return await ctx.channel.send(f"Failed to find role: {role}")
        await ctx.author.add_roles(*discord_roles)
        await self.ack_command(ctx)

    @role.command()
    async def remove(self, ctx, *roles):
        if ctx.channel.id != self.cfg.channel:
            return
        if len(roles) <= 0:
            return await ctx.channel.send(
                "No roles provided. Use `role clean` to clear your assignable roles."
            )

        discord_roles = []
        for role in roles:
            try:
                discord_roles.append(self.get_role(ctx.guild, role))
            except KeyError as NotValid:
                return await ctx.channel.send(f"Failed to find role: {role}")
        await ctx.author.remove_roles(*discord_roles)
        await self.ack_command(ctx)

    @role.command()
    async def clean(self, ctx):
        if ctx.channel.id != self.cfg.channel:
            return

        discord_roles = []
        for role, _ in self.cfg.roles.items():
            discord_roles.append(self.get_role(ctx.guild, role))
        await ctx.author.remove_roles(*discord_roles)
        await self.ack_command(ctx)
