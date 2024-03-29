const google = require('googlethis');
const options = {
	page: 0,
	safe: true,
	parse_ads: false,
	additional_params: {
		hl: 'en'
	}
};

async function search(query) {
	try {
		const response = await google.search(query, options);
		return response;
	}
	catch (error) {
		return 'error';
	}
}

module.exports = { search };