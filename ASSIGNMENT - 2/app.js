const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (if needed)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for logging request timestamps
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Helper function to read tasks from JSON file
const readTasks = () => {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return empty array if file doesn't exist or error occurs
  }
};

// Helper function to write tasks to JSON file
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

// Routes

// GET /tasks: Show all tasks

app.get('/', (req, res) => {
    res.redirect('/tasks'); // Redirect to the /tasks route
  }); 
  
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.render('tasks', { tasks });
});

// GET /task?id=:id: Fetch a specific task
app.get('/task', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.query.id); // Parse ID as integer

  if (isNaN(taskId)) {
    return res.status(400).send('Invalid task ID');
  }

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).send('Task not found');
  }

  res.render('task', { task });
});

// POST /add-task: Add a new task
app.post('/add-task', (req, res) => {
  const tasks = readTasks();
  const newTask = req.body;

  // Basic validation (you should add more robust validation)
  if (!newTask.title || !newTask.description) {
    return res.status(400).send('Title and description are required');
  }

  // Assign a unique ID (you can use a library like uuid for more robust ID generation)
  newTask.id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1; 

  tasks.push(newTask);
  writeTasks(tasks);

  res.redirect('/tasks'); // Redirect back to the tasks page
});

app.get('/add', (req, res) => {
  res.render('addTask');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});