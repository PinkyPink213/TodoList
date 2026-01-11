const { createTask } = require('../services/taskService');
const { response } = require('../utils/response');

exports.handler = async (task) => {
	try {
		// console.log('RAW task:', JSON.stringify(task));
		let body = {};

		// Handles all cases safely
		if (typeof task === 'string') {
			body = JSON.parse(task);
		} else if (task?.body) {
			body = typeof task.body === 'string' ? JSON.parse(task.body) : task.body;
		} else {
			body = task;
		}
		// console.log('BODY task:', body);
		const result = await createTask(body);
		return response(201, result);
	} catch (err) {
		return response(400, { error: err.message });
	}
};
