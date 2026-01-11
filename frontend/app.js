const API_URL =
	'https://uucmj3pv6b.execute-api.ap-southeast-1.amazonaws.com/prod';

let currentEditId = null;
let currentFilter = 'all';

// Load
document.addEventListener('DOMContentLoaded', () => {
	loadTasks();
	initFilters();
	initTheme();
});

// ----- LOAD TASKS -----
async function loadTasks() {
	const res = await fetch(`${API_URL}/tasks`);
	let tasks = await res.json();

	// Auto sort: active on top, completed bottom
	tasks.sort((a, b) => (a.status === 'completed') - (b.status === 'completed'));

	renderTasks(tasks);
}

// Render tasks into list
function renderTasks(tasks) {
	const list = document.getElementById('taskList');
	list.innerHTML = '';

	tasks
		.filter((task) => {
			if (currentFilter === 'active') return task.status !== 'completed';
			if (currentFilter === 'completed') return task.status === 'completed';
			return true;
		})
		.forEach((task) => {
			const li = document.createElement('li');
			li.className = 'list-group-item d-flex align-items-center';

			li.innerHTML = `
                <input type="checkbox" class="form-check-input me-3 checkbox-animate"
                       onclick="toggleTask('${task.taskId}', this.checked)"
                       ${task.status === 'completed' ? 'checked' : ''}>

                <span class="flex-fill ${
									task.status === 'completed' ? 'completed' : ''
								}">
                    ${task.title}
                </span>

                <button class="btn btn-sm btn-outline-primary me-2"
                        onclick="openEdit('${
													task.taskId
												}', '${task.title.replace(/'/g, "\\'")}')">
                    Edit
                </button>

                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteTask('${task.taskId}')">
                    Delete
                </button>
            `;

			list.appendChild(li);
		});
}

// ----- CREATE TASK -----
async function createTask() {
	const input = document.getElementById('taskInput');
	const title = input.value.trim();
	if (!title) return;

	await fetch(`${API_URL}/tasks`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title }),
	});

	input.value = '';
	showToast('Task added!');
	loadTasks();
}

// ----- TOGGLE COMPLETED -----
async function toggleTask(id, checked) {
	const status = checked ? 'completed' : 'pending';

	// Instant UI update
	const li = event.target.closest('li');
	const titleSpan = li.querySelector('span');

	if (checked) {
		titleSpan.classList.add('completed');
		showToast('Task completed!');
	} else {
		titleSpan.classList.remove('completed');
		showToast('Task marked active');
	}

	// PUT update to DB
	await fetch(`${API_URL}/tasks/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status: status }),
	});

	// Reload to re-sort & apply filters
	loadTasks();
}

// ----- DELETE -----
async function deleteTask(id) {
	await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
	showToast('Task deleted');
	loadTasks();
}

// ----- EDIT MODAL -----
function openEdit(id, title) {
	currentEditId = id;
	document.getElementById('editInput').value = title;
	new bootstrap.Modal(document.getElementById('editModal')).show();
}

async function saveEdit() {
	const newTitle = document.getElementById('editInput').value.trim();
	if (!newTitle) return;

	await fetch(`${API_URL}/tasks/${currentEditId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title: newTitle }),
	});

	showToast('Task updated!');
	loadTasks();

	bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
}

// ----- FILTER TABS -----
function initFilters() {
	document.querySelectorAll('#filterTabs .nav-link').forEach((tab) => {
		tab.addEventListener('click', (e) => {
			e.preventDefault();
			document.querySelector('#filterTabs .active')?.classList.remove('active');
			tab.classList.add('active');

			currentFilter = tab.dataset.filter;
			loadTasks();
		});
	});
}

// ----- TOAST -----
function showToast(message) {
	const toastBox = document.getElementById('toastBox');

	const toast = document.createElement('div');
	toast.className =
		'toast align-items-center text-white bg-primary border-0 mb-2';
	toast.role = 'alert';
	toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"></button>
        </div>
    `;

	toastBox.appendChild(toast);
	const bsToast = new bootstrap.Toast(toast);
	bsToast.show();
}

// ----- DARK MODE -----
function initTheme() {
	const theme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', theme);
	updateThemeIcon(theme);

	document.getElementById('themeToggle').onclick = () => {
		const newTheme =
			document.documentElement.getAttribute('data-theme') === 'dark'
				? 'light'
				: 'dark';
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		updateThemeIcon(newTheme);
	};
}

function updateThemeIcon(theme) {
	document.querySelector('#themeToggle i').className =
		theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
}
