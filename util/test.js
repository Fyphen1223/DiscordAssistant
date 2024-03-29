/* eslint-disable no-unused-vars */
const { search } = require('./search');
const { generate } = require('./llm');
const gpt = require('./gpt');

async function main() {
	const queue = new gpt.queue();
	const ai = queue.add('123');
	console.log(await ai.add('安倍総理が銃撃されたのはいつですか？'));
}

main();