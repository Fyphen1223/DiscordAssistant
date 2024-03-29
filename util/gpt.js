const fs = require('fs');

const { generate } = require('./llm');
const { search } = require('./search');
const { scrape } = require('./scraper');

class queue {
	constructor() {
		this.queue = [];
	}
	add(channelId) {
		this[channelId] = new channelChat(channelId);
		this[channelId].init();
		return this[channelId];
	}
}

async function handleAccess(res, messages) {
	const url = res.replace('access:', '');
	const scraped = await scrape(url);
	const response = await generate(JSON.stringify({
		'messages': messages,
		'prompt': scraped,
		'model': 'GPT-4',
		'markdown': false,
	}));
	//responseはassistantの返答
	messages.push({
		'role': 'user',
		'content': scrape,
	});
	messages.push({
		'role': 'assistant',
		'content': response,
	});
	return { response, messages };
}

class channelChat {
	constructor(channelId) {
		this.channelId = channelId;
		this.messages = [];
	}
	init = async () => {
		this.messages.push({
			'role': 'user',
			'content': fs.readFileSync('../assets/prompt.txt', 'utf8').toString(),
		});
		this.messages.push({
			'role': 'assistant',
			'content': 'Yes',
		});
	};
	add = async (message) => {
		const res = await generate(JSON.stringify({
			'messages': this.messages,
			'prompt': message,
			'model': 'GPT-4',
			'markdown': false,
		}));
		this.messages.push({
			'role': 'user',
			'content': message,
		});
		this.messages.push({
			'role': 'assistant',
			'content': res,
		});
		if (res.startsWith('access:')) {
			let { messageToRespond, messages } = await handleAccess(res, this.messages);
			this.messages = messages;
			return messageToRespond;
		}
		if (res.startsWith('search:')) {
			const query = res.replace('search:', '');
			const searchResult = await search(query);
			let searchText = '';
			searchResult.results.forEach(element => {
				searchText = searchText + element.title + ' ' + element.description + ' ' + element.url + '\n';
			});
			const finalRes = await generate(JSON.stringify({
				'messages': this.messages,
				'prompt': searchText,
				'model': 'GPT-4',
				'markdown': false,
			}));
			this.messages.push({
				'role': 'user',
				'content': searchText,
			});
			return finalRes;
		}
		return res;
	};
}

module.exports = { queue, channelChat };