const {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
} = require('./services/taskServices');

exports.handler = async (task) => {
	console.log('task:', JSON.stringify(task));

	try {
		const { routeKey, pathParameters } = task;

		let body = {};
		if (task.body) {
			try {
				body = JSON.parse(task.body);
			} catch (err) {
				return {
					statusCode: 400,
					body: JSON.stringify({ error: 'Invalid JSON' }),
				};
			}
		}

		switch (routeKey) {
			case 'GET /tasks':
				return { statusCode: 200, body: JSON.stringify(await getTasks()) };

			case 'GET /tasks/{id}':
				return {
					statusCode: 200,
					body: JSON.stringify(await getTaskById(pathParameters.id)),
				};

			case 'POST /tasks':
				return {
					statusCode: 201,
					body: JSON.stringify(await createTask(body)),
				};

			case 'PUT /tasks/{id}':
				return {
					statusCode: 200,
					body: JSON.stringify(await updateTask(pathParameters.id, body)),
				};

			case 'DELETE /tasks/{id}':
				await deleteTask(pathParameters.id);
				return {
					statusCode: 200,
					body: JSON.stringify({ message: 'Task deleted successfully' }),
				};

			default:
				return {
					statusCode: 404,
					body: JSON.stringify({ error: 'Route not found' }),
				};
		}
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
};
