require('./connect')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    name: String,
    isDoing: Boolean,
    createDate: Date, 
}, {versionKey: false})


exports.Todo = mongoose.model('Todo', todoSchema)

const user = new Schema({
    token:String,
    username: String,
    password:String,
    createDate: Number, 
}, {versionKey: false})


exports.User = mongoose.model('user', user)
