/* eslint-disable no-unused-vars */
const gpt = require('./gpt');

async function main() {
	const queue = new gpt.queue();
	const ai = queue.add('123');
	console.log(await ai.add('明日の交野市の天気を教えて下さい'));
}

main();