/* eslint-disable no-unused-vars */
const gpt = require('./gpt');

async function main() {
	const queue = new gpt.queue();
	const ai = queue.add('123');
	console.log(await ai.add('このページにアクセスしてその内容を要約して下さい。https://qiita.com/hiroki1994/items/6422bcb2db05c3af25ed'));
}

main();