const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const { webSummarizer } = require('./gpt');

const summarizer = new webSummarizer();

async function main() {
	const res = await axios.get('https://magazine.techacademy.jp/magazine/32986');
	const dom = new JSDOM(res.data);
	const pElements = dom.window.document.querySelectorAll('p');
	let content = '';
	pElements.forEach((pElement) => {
		content = content + pElement.textContent;
	});
	const fin = await summarizer.summarize(content);
	console.log(fin);
}

main();