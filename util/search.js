const google = require('googlethis');
const options = {
	page: 0,
	safe: false,
	parse_ads: false,
	additional_params: {
	}
};

async function search(query) {
	const response = await google.search(query, options);
	return response;
}

module.exports = { search };