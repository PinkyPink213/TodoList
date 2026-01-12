const dynamoDB = require('../db/dynamoClient');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'TodoTasks';

async function createTask(data) {
	if (!data.title || data.title.trim() === '') {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Title is required' }),
		};
	}
	const item = {
		taskId: uuidv4(),
		title: data.title,
		taskstatus: 'active',
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

async function updateTask(taskId, data) {
	const now = new Date().toISOString();

	let updateExp = 'SET updatedAt = :updatedAt';
	let attrValues = { ':updatedAt': now };

	if (data.title !== undefined) {
		updateExp += ', title = :title';
		attrValues[':title'] = data.title;
	}

	if (data.taskstatus !== undefined) {
		updateExp += ', taskstatus = :taskstatus';
		attrValues[':taskstatus'] = data.taskstatus;
	}

	const params = {
		TableName: TABLE_NAME,
		Key: { taskId },
		UpdateExpression: updateExp,
		ExpressionAttributeValues: attrValues,
		ReturnValues: 'ALL_NEW',
	};

	const result = await dynamoDB.update(params).promise();
	return result.Attributes;
}

async function deleteTask(taskId) {
	await dynamoDB
		.delete({
			TableName: TABLE_NAME,
			Key: { taskId },
		})
		.promise();

	return { message: 'Task deleted successfully' };
}

module.exports = {
	createTask,
	getTaskById,
	getTasks,
	updateTask,
	deleteTask,
};
