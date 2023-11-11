const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Todo = require('./models/todo');

mongoose.connect('mongodb://127.0.0.1:27017/todo');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Setting up routes
app.get('/', (async(req, res) => {
    const todos = await Todo.find({});
    res.render('home.ejs', { todos });
}))

app.post('/todos', (async (req, res, next) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.redirect(`/`);
}))

app.delete('/todos/:id', (async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.redirect('/');
}))

app.listen(3000, () => {
    console.log('Serving on port 3000');
})