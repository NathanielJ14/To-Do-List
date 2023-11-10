const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: String,
    description: String,
    date: Date,
    location: String
});

module.exports = mongoose.model('Todo', TodoSchema);