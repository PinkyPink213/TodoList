const { getTasks, getTaskById } = require('./handlers/getTasks');
const { createTask } = require('./handlers/createTask');
const { updateTask } = require('./handlers/updateTask');
const { deleteTask } = require('./handlers/deleteTask');

exports.handler = async (event) => {
	console.log('Event:', JSON.stringify(event));

	try {
		const { routeKey, pathParameters } = event;

		// Safe JSON parse
		let body = {};
		if (event.body) {
			try {
				body = JSON.parse(event.body);
			} catch (e) {
				return {
					statusCode: 400,
					body: JSON.stringify({ error: 'Invalid JSON body' }),
				};
			}
		}

		switch (routeKey) {
			case 'GET /tasks':
				return {
					statusCode: 200,
					body: JSON.stringify(await getTasks()),
				};

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
		console.error('Error:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
};
