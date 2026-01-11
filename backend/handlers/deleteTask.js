const taskService = require('../services/taskService');
const { error } = require('../utils/response');

exports.deleteTask = async (req, res) => {
	try {
		const { id } = req.params;

		// check if task exists
		const task = await taskService.getTask(id);
		if (!task) {
			return error(res, 'Task not found', 404);
		}

		await taskService.deleteTask(id);
		return res.status(204).send(); // no content
	} catch (err) {
		console.error('Delete Task Error:', err);
		return error(res);
	}
};
