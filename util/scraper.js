const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
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

async function scrape(url) {
	const res = await axios.get(url);
	const dom = new JSDOM(res.data);
	const pElements = dom.window.document.querySelectorAll('p');
	let content = '';
	pElements.forEach((pElement) => {
		content = content + pElement.textContent;
	});
	content = content.replace(/\s/g, '');
	const fin = await summarize(content);
	return fin;
}

module.exports = { scrape };