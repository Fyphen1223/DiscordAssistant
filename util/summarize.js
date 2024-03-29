const { generate } = require('./llm');

async function summarize(content) {
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
}

module.exports = { summarize };