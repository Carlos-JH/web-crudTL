const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");

// Middleware  analiza cuerpos d S JSON
app.use(express.json());

// sirve archivos estáticos desde el directorio "public"
app.use(express.static('public'));

// Ruta básica 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/tasks.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

let tasks = [];
let currentId = 1;

app.get('/tasks', (req, res) => {
    res.json(tasks);
});


//creamos
app.post('/tasks', (req, res) => {
    console.log('Datos recibidos:', req.body); 
    const newTask = {
        id: currentId++,
        title: req.body.title,
        description: req.body.description, 
        completed: req.body.completed || false 
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});



//eliminamos
app.delete('/tasks/:id', (req, res) => { 
    const taskId = parseInt(req.params.id); 
    console.log('ID recibido para eliminar:', taskId); // Añadir para depuración
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});


//editamos
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    console.log("tarea",taskId);
    console.log('Datos recibidos editar:', req.body);
    

    // Actualizar la tarea en el array
    //task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    res.json(task);
    
});

