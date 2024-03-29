const axios = require('axios');

const generate = async (query) => {
	const response = await axios({
		method: 'POST',
		url: 'https://nexra.aryahcr.cc/api/chat/gpt',
		headers: {
			'Content-Type': 'application/json',
		},
		data: query,
	});
	return response.data.gpt;
};

module.exports = { generate };