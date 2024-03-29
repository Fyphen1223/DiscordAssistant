const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const gpt = require('./gpt.js');
const summarizer = new gpt.WebSummarizer();


async function scrape(url) {
	const res = await axios.get(url);
	const dom = new JSDOM(res.data);
	const pElements = dom.window.document.querySelectorAll('p');
	let content = '';
	pElements.forEach((pElement) => {
		content = content + pElement.textContent;
	});
	content = content.replace(/\s/g, '');
	const fin = await summarizer.summarize(content);
	return fin;
}

module.exports = { scrape };