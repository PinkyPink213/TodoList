const {
	dynamo,
	TABLE = 'TodoTasks',
	ScanCommand,
	GetCommand,
	PutCommand,
	UpdateCommand,
	DeleteCommand,
} = require('../db/dynamoClient');
const { v4: uuidv4 } = require('uuid');

// GET ALL
exports.getAllTasks = async () => {
	const res = await dynamo.send(new ScanCommand({ TableName: TABLE }));
	return res.Items;
};

// GET ONE
exports.getTask = async (taskId) => {
	const res = await dynamo.send(
		new GetCommand({
			TableName: TABLE,
			Key: { taskId },
		})
	);
	return res.Item;
};

// CREATE
exports.createTask = async (data) => {
	const task = {
		taskId: uuidv4(),
		title: data.title,
		description: data.description || '',
		status: 'pending',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	await dynamo.send(
		new PutCommand({
			TableName: TABLE,
			Item: task,
		})
	);

	return task;
};

// UPDATE
exports.updateTask = async (taskId, data) => {
	data.updatedAt = new Date().toISOString();

	const keys = Object.keys(data).filter((k) => data[k] !== undefined);

	const updateExp = [];
	const names = {};
	const values = {};

	keys.forEach((k) => {
		updateExp.push(`#${k} = :${k}`);
		names[`#${k}`] = k;
		values[`:${k}`] = data[k];
	});

	const res = await dynamo.send(
		new UpdateCommand({
			TableName: TABLE,
			Key: { taskId },
			UpdateExpression: `SET ${updateExp.join(', ')}`,
			ExpressionAttributeNames: names,
			ExpressionAttributeValues: values,
			ReturnValues: 'ALL_NEW',
		})
	);

	return res.Attributes;
};

// DELETE
exports.deleteTask = async (taskId) => {
	await dynamo.send(
		new DeleteCommand({
			TableName: TABLE,
			Key: { taskId },
		})
	);
};
