const taskService = require('../services/taskService');
const { success, error } = require('../utils/response');

// GET /tasks -> List all tasks
exports.getTasks = async (req, res) => {
	try {
		const tasks = await taskService.getAllTasks();
		return success(res, tasks, 200);
	} catch (err) {
		console.error('[GET /tasks] Error:', err);
		return error(res, 'Failed to fetch tasks', 500);
	}
};

// GET /tasks/:id -> Get single task
exports.getTaskById = async (req, res) => {
	try {
		const taskId = req.params.id;
		const task = await taskService.getTask(taskId);

		if (!task) {
			return error(res, 'Task not found', 404);
		}

		return success(res, task, 200);
	} catch (err) {
		console.error(`[GET /tasks/${req.params.id}] Error:`, err);
		return error(res, 'Failed to fetch task', 500);
	}
};
