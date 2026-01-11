const express = require('express');
const bodyParser = require('body-parser');

const { getTasks, getTaskById } = require('./handlers/getTasks');
const { createTask } = require('./handlers/createTask');
const { updateTask } = require('./handlers/updateTask');
const { deleteTask } = require('./handlers/deleteTask');

const app = express();
app.use(bodyParser.json());

// Routes
app.get('/tasks', getTasks); // Get all tasks
app.get('/tasks/:id', getTaskById); // Get single task
app.post('/tasks', createTask); // Create task
app.put('/tasks/:id', updateTask); // Update task
app.delete('/tasks/:id', deleteTask); // Delete task

// Server
app.listen(3000, () => console.log('Server running on 3000'));
