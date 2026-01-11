const taskService = require('../services/taskService');

exports.updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const task = await taskService.updateTask(id, req.body);
		res.status(200).json(task);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to update task' });
	}
};
