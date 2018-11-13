require('./db')
const path = require('path')
const express = require('express')
const Todo = require('./db').Todo
const bodyParser = require('body-parser')
const app = new express()
const whiteList = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']

const allowCrossDomain = (req, res, next) => {
    if (whiteList.indexOf(req.headers.origin) >= 0) {
        res.header('Access-Control-Allow-Origin', req.headers.origin)
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.header('Access-Control-Allow-Credentials', 'true')
        res.setHeader("Access-Control-Max-Age", "3600")
    }
    next()
}

app.use(allowCrossDomain)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(
    path.join(__dirname, '..', '/build/')
))

app.use((req, res, next) => {
    console.log(`接收到${req.method}方法，请求地址为${req.url}`)
    next()
})

app.get('/todoList',
    async (req, res, next) => {
        try {
            let data = await Todo.find({})
            res.json({ data, success: true })
        } catch (e) {
            res.json({ data: [], success: false })
        }

    },
)

app.get('/todoList/:name',
    async (req, res, next) => {
        const params = { name: { $regex: new RegExp(`${req.params.name}`) } }

        try {
            let data = await Todo.find(params)
            res.json({ data, success: true })
        } catch (e) {
            res.json({ data: [], success: false })
        }
    }
)

app.post('/todoList',
    async (req, res, next) => {
        const todo = new Todo({ ...req.body })
        try {
            let data = await todo.save()
            res.json({ data, success: true })
        } catch (err) {
            res.json({ data: { err }, success: false })
        }

    }
)

app.delete('/todoList/:name',
    async (req, res, next) => {
        const params = { name: req.params.name }
        try {
            let data = await Todo.findOneAndDelete(params)
            res.json({ data, success: true })
        } catch (err) {
            res.json({ data: { err }, success: false })
        }
    }
)

app.listen(3001, () => console.log('listen 3001 now'))
