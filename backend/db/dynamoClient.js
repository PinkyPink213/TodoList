const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
	region: process.env.AWS_REGION || 'ap-southeast-1',
});

module.exports = dynamoDB;
