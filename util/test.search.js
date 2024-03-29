const { search } = require('./search');

async function main() {
	const result = await search('安倍総理が銃撃されたのはいつですか？');
	console.log(result.results[0].description);
}

main();