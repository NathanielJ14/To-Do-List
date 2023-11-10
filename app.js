const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {todoSchemaSchema} = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Todo = require('./models/todo');

mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateTodo = (req, res, next) => {
    const { error } = todoSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// Setting up routes
app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/todo', catchAsync(async (req, res) => {
    const todos = await Todo.find({});
    res.render('todo/index', { todos });
}))

app.get('/todos/new', async (req, res) => {
    res.render('todos/new');
})

app.post('/todos', validateTodo, catchAsync(async (req, res, next) => {
     // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const todo = new Todo(req.body.todo);
    await todo.save();
    res.redirect(`/todos/${todo._id}`)
}))

app.get('/todos/:id', catchAsync(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.render('todos/show', { todo });
}))

app.get('/todos/:id/edit', catchAsync(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.render('todos/edit', { todo });
}))

app.put('/todos/:id', validateTodo, catchAsync(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(id, { ...req.body.todo });
    res.redirect(`/todos/${todo._id}`);
}))

app.delete('/todos/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.redirect('/todos');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})