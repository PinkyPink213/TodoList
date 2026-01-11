const dynamoDB = require('../db/dynamoClient');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'TodoTasks';
async function createTask(data) {
	const item = {
		taskId: uuidv4(),
		title: data.title,
		description: data.description || '',
		status: 'pending',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	await dynamoDB
		.put({
			TableName: TABLE_NAME,
			Item: item,
		})
		.promise();

	return item;
}

async function getTaskById(taskId) {
	const result = await dynamoDB
		.get({
			TableName: TABLE_NAME,
			Key: { taskId },
		})
		.promise();

	return result.Item;
}

async function getTasks() {
	const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
	return result.Items;
}

module.exports = {
	createTask,
	getTaskById,
	getTasks,
	updateTask,
	deleteTask,
};
