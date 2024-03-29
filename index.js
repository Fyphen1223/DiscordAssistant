/* eslint-disable no-empty */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const config = require('./config.json');

const { queue, channelChat } = require('./util/gpt');

const aiQueue = new queue();

const discord = require('discord.js');
const client = new discord.Client({
	intents: [
		discord.GatewayIntentBits.GuildEmojisAndStickers,
		discord.GatewayIntentBits.GuildIntegrations,
		discord.GatewayIntentBits.GuildInvites,
		discord.GatewayIntentBits.GuildMembers,
		discord.GatewayIntentBits.GuildMessageReactions,
		discord.GatewayIntentBits.GuildMessageTyping,
		discord.GatewayIntentBits.GuildMessages,
		discord.GatewayIntentBits.GuildPresences,
		discord.GatewayIntentBits.GuildScheduledEvents,
		discord.GatewayIntentBits.GuildVoiceStates,
		discord.GatewayIntentBits.GuildWebhooks,
		discord.GatewayIntentBits.Guilds,
		discord.GatewayIntentBits.MessageContent,
	],
	partials: [
		discord.Partials.Channel,
		discord.Partials.GuildMember,
		discord.Partials.GuildScheduledEvent,
		discord.Partials.Message,
		discord.Partials.Reaction,
		discord.Partials.ThreadMember,
		discord.Partials.User,
	],
});

client.on('ready', () => {
	console.log('Bot is ready');
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	const channelId = message.channel.id;
	if (!aiQueue[channelId]) return;
	const content = message.content;
	const ai = aiQueue[channelId];
	const response = await ai.add(content);
	message.channel.sendTyping();
	message.reply(response.response);
});


client.on('interactionCreate', async (interaction) => {
	const channelId = interaction.channel.id;
	let subcommand;
	try {
		subcommand = interaction.options.getSubcommand();
	} catch (e) {
	}
	if (interaction.commandName === 'debug') {
		interaction.reply(`Debugging\n${JSON.stringify(aiQueue[channelId].messages.slice(1))}`);
	}
	if (interaction.commandName === 'chat') {
		if (subcommand === 'enable') {
			interaction.reply('Enabled chat on this channel.');
			delete aiQueue[channelId];
			aiQueue.add(channelId);
		} else {
			interaction.reply('Disabled chat on this channel.');
			delete aiQueue[channelId];
		}
	}
});

process.on('uncaughtException', (err) => {
	console.error(err);
});

client.login(config.token);