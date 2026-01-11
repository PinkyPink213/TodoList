exports.validateTaskInput = (data) => {
	const errors = {};

	if (!data.title || data.title.trim() === '') {
		errors.title = 'Title is required';
	}

	if (data.status && !['pending', 'done'].includes(data.status)) {
		errors.status = 'Invalid status value';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};
