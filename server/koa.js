require('./db')
const path = require('path')
const Koa = require('koa')
// const pm2 = require('pm2')
// const fs = require('fs')
const router = require('koa-router')()
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
// const compose = require('koa-compose')
const cors = require('koa2-cors')
const Todo = require("./db").Todo
const app = new Koa()
const whiteList = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']

app.use(koaStatic(
    path.join(__dirname, '../build/')
))

app.use((ctx, next) => {
    console.log(`接收到${ctx.request.method}方法，请求地址为${ctx.request.url}`)
    next()
})

router.get('/todoList',
    async ctx => {
        try {
            let data = await Todo.find({})
            ctx.body = { data, success: true }
        } catch (e) {
            ctx.body = { data: [], success: false }
        }

    },
)

router.get('/todoList/:name',
    async ctx => {
        const params = { name: { $regex: new RegExp(`${ctx.params.name}`) } }

        try {
            let data = await Todo.find(params)
            ctx.body = { data, success: true }
        } catch (e) {
            ctx.body = { data: [], success: false }
        }
    }
)

router.post('/todoList', koaBody(),
    async ctx => {
        const todo = new Todo({ ...ctx.request.body })
        try {
            let data = await todo.save()
            ctx.body = { data, success: true }
        } catch (err) {
            ctx.body = { data: { err }, success: false }
        }

    }
)

router.del('/todoList/:name',
    async ctx => {
        const params = { name: ctx.params.name }
        try {
            let data = await Todo.findOneAndDelete(params)
            ctx.body = { data, success: true }
        } catch (err) {
            ctx.body = { data: { err }, success: false }
        }
    }
)

app.use(cors({
    maxAge: 1000 * 60 * 60 * 24 * 356,
    credentials: true,//允许携带cookie
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
    origin: ctx => {
        if (whiteList.indexOf(ctx.origin) < 0) return false

        return '*'
    },
}))

app.use(router.routes())

app.listen(3001, () => console.log('listen 3001 now'))
