const fs = require('fs');

const { generate } = require('./llm');
const { search } = require('./search');

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
			const url = res.replace('access:', '');
			const response = await generate(JSON.stringify({
				'messages': this.messages,
				'prompt': 'search:' + url,
				'model': 'GPT-4',
				'markdown': false,
			}));
			this.messages.push({
				'role': 'assistant',
				'content': response,
			});
			return response;
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

class webSummarizer {
	constructor() {
		this.queue = new queue();
	}
	summarize = async function (content) {
		const res = await generate(JSON.stringify({
			'messages': [{
				'role': 'user',
				'content': 'Your mission is to delete ad text(such as PR) from the web-page\'s text that user gives you. Do not summarize, please just delete ad part. You should not delete some type of content such as code, sicne this can affect proper actions. Return ONLY shortend content.',
			},
			{
				'role': 'assistant',
				'content': 'Yes',
			}],
			'prompt': content,
			'model': 'gpt-3.5-turbo',
			'markdown': false,
		}));
		return res;
	};
}

module.exports = { queue, channelChat, webSummarizer };