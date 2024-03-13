const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];
let users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = { username, password, tasks: [] };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.post('/tasks', (req, res) => {
    const { title, description, dueDate, category, priorityLevel, username } = req.body;
    const newTask = { title, description, dueDate, category, status: 'incomplete', priorityLevel };
    const user = users.find(user => user.username === username);
    if (user) {
        user.tasks.push(newTask);
        res.status(201).json(newTask);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.put('/tasks/:username/:taskTitle', (req, res) => {
    const { username, taskTitle } = req.params;
    const user = users.find(user => user.username === username);
    if (user) {
        const task = user.tasks.find(task => task.title === taskTitle);
        if (task) {
            task.status = 'completed';
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/tasks', (req, res) => {
    const { username, sortField = 'dueDate', sortOrder = 'asc' } = req.query;
    const user = users.find(user => user.username === username);
    if (user) {
        const sortedTasks = [...user.tasks].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });
        res.json(sortedTasks);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));