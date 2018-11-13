require('./connect')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    name: String,
    isDoing: Boolean,
    createDate: Date, 
}, {versionKey: false})


const Todo = mongoose.model('Todo', todoSchema)
exports.Todo=Todo;