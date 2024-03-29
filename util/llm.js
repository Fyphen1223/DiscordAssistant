/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const config = require('../config.json');

const axios = require('axios');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(config.googleToken);

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_VIOLENCE,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_MEDICAL,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_ILLEGAL,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SPAM,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_OTHER,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_PERSONAL_ATTACK,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_TOXICITY,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_THREATS,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_IDENTITY_ATTACK,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT_ADULT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_CHILD_SEXUAL_ABUSE,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_CHILD_ENDANGERMENT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	}
];

const generate = async (query) => {
	if (!config.useGemini) {
		const response = await axios({
			method: 'POST',
			url: 'https://nexra.aryahcr.cc/api/chat/gpt',
			headers: {
				'Content-Type': 'application/json',
			},
			data: query,
		});
		return response.data.gpt;
	} else {
		const model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings });
		const original = JSON.parse(query);
		original.messages = original.messages.map(message => {
			if (message.role === 'assistant') {
				return { ...message, role: 'model' };
			} else {
				return message;
			}
		});
		original.messages = original.messages.map(({ content, ...message }) => {
			return { ...message, parts: [{ text: content }] };
		});
		const chat = model.startChat({
			history: original.messages,
			generationConfig: {
				maxOutputTokens: 10000,
			},
		});
		const result = await chat.sendMessage(original.prompt);
		const response = await result.response;
		const text = response.text();
		return text;
	}
};

// messagesとprompt

module.exports = { generate };