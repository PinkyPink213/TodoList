const response = (statusCode, body = {}) => ({
	statusCode,
	body: JSON.stringify(body),
});

module.exports = { response };
