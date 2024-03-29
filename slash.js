/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const config = require('./config.json');

var start = new Date();
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const commands = [
	new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Configure GPT')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('enable')
				.setDescription('Set GPTs on this channel')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('disable')
				.setDescription('Remove GPTs on this channel')
		),
	new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Debugging')
].map((command) => command.toJSON());
const rest = new REST({ version: '10' }).setToken(config.token);
const reset = [];
rest
	.put(Routes.applicationCommands(config.applicationId), { body: commands })
	.then((data) =>
		console.log(
			`Successfully registered ${data.length} application commands with ${(new Date() - start) / 1000
			}s`,
		),
	)
	.catch(console.error);