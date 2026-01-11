const { deleteTask } = require('../services/taskService');

exports.handler = async (task) => {
	try {
		const taskId = task.pathParameters?.id;
		if (!taskId) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'Missing task ID' }),
			};
		}

		await deleteTask(taskId);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Task deleted successfully' }),
		};
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
};
