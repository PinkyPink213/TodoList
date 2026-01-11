const taskService = require('../services/taskService');
const { validateTaskInput } = require('../utils/validator');
const { success, error } = require('../utils/response');

exports.createTask = async (req, res) => {
	const { isValid, errors } = validateTaskInput(req.body);

	if (!isValid) {
		return error(res, errors, 400);
	}

	try {
		const task = await taskService.createTask(req.body);
		return success(res, task, 201);
	} catch (err) {
		console.error('Create error:', err);
		return error(res);
	}
};
