const { getTaskById } = require('../services/taskService');
const { response } = require('../utils/response');

exports.handler = async (task) => {
	try {
		const taskId = task.pathParameters.id;
		const result = await getTaskById(taskId);
		return response(200, result);
	} catch (err) {
		return response(404, { error: err.message });
	}
};
