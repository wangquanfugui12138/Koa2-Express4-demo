require('./db')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const router = require('koa-router')()
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const archiver = require('archiver')
const send = require('koa-send')

const Todo = require("./db").Todo

const app = new Koa()
const whiteList = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']

app.use(koaStatic(
    path.join(__dirname, '..', '/build/')
)).use(async (ctx, next) => {
    console.log(`接收到${ctx.request.method}方法，请求地址为${ctx.request.url}`)
    await next()
}).use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,// 设置上传文件大小最大限制，默认2M
    }
})).use(cors({
    maxAge: 3600,
    credentials: true,//允许携带cookie
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    allowHeaders: ['Origin', 'Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous', 'X-Requested-With'],
    origin: ctx => {
        if (whiteList.indexOf(ctx.request.header.origin) === -1) return false

        return ctx.request.header.origin
    },
})).use(
    async (ctx, next) => {
        if (ctx.request.method === "OPTIONS") {
            ctx.response.status = 200
            ctx.set('Access-Control-Allow-Origin', ctx.request.headers.origin)
            ctx.set("Access-Control-Max-Age", 24 * 60 * 60 * 1000);
            ctx.set("Access-Control-Allow-Methods", 'GET,POST,OPTIONS,DELETE,PUT');
            ctx.set("Access-Control-Allow-Headers", 'Origin,Content-Type,Authorization,Accept,X-Custom-Header,anonymous,X-Requested-With')
            ctx.body = ''
        } else {
            await next()
        }

    }
)
router.get('/downloadFile/:name',
    async ctx => {
        ctx.set('Content-disposition', `attachment;filename=${ctx.params.name}`);
        const paths = `src/assets/upload/files/${ctx.params.name}`

        const data = fs.createReadStream(paths) // 发送路径文件内容的文件

        ctx.body = data
    }
).get('/downloadImg/:name',
    async ctx => {
        ctx.set('Content-disposition', `attachment;filename=${ctx.params.name}`);
        const paths = `src/assets/upload/imgs/${ctx.params.name}`;

        ctx.attachment(paths);
        await send(ctx, paths);
    }
).get('/batchDownload',
    async ctx => {
        const list = [{ name: '1.jpg', path: 'src/assets/upload/imgs/1.jpg' }, { name: '1.csv', path: 'src/assets/upload/files/1.csv' }, { name: '2.png', path: 'src/assets/upload/imgs/2.png' }];
        const zipName = 'download.zip';
        const zipPath = `src/assets/download/${zipName}`;
        const zipStream = fs.createWriteStream(zipPath);
        const zip = archiver('zip');
        zip.pipe(zipStream);

        for (let i = 0; i < list.length; i++) {
            // 添加单个文件到压缩包
            zip.append(fs.createReadStream(list[i].path), { name: list[i].name })
        }
        await zip.finalize();
        ctx.attachment(zipPath);
        await send(ctx, zipPath);
    }
).post('/upload',
    ctx => {
        try {
            const files = ctx.request.files.file
            files.length ?
                files.forEach(file =>
                    fs
                        .createReadStream(file.path)
                        .pipe(fs.createWriteStream(`${file.type.indexOf('image') >= 0 ? 'src/assets/upload/imgs' : 'src/assets/upload/files'}/${file.name}`))
                ) :
                fs
                    .createReadStream(files.path)
                    .pipe(fs.createWriteStream(`${files.type.indexOf('image') >= 0 ? 'src/assets/upload/imgs' : 'src/assets/upload/files'}/${files.name}`))

            ctx.body = '上传成功'
        } catch (e) {
            ctx.body = '上传失败'
        }
    }
).get('/todoList',
    async ctx => {
        try {
            let data = await Todo.find({})
            ctx.body = { data, success: true }
        } catch (e) {
            ctx.body = { data: [], success: false }
        }

    },
).get('/todoList/:name',
    async ctx => {
        const params = { name: { $regex: new RegExp(`${ctx.params.name}`) } }

        try {
            let data = await Todo.find(params)
            ctx.body = { data, success: true }
        } catch (e) {
            ctx.body = { data: [], success: false }
        }
    }
).post('/todoList', koaBody(),
    async ctx => {
        const todo = new Todo({ ...ctx.request.body })
        try {
            let data = await todo.save()
            ctx.body = { data, success: true }
        } catch (err) {
            ctx.body = { data: { err }, success: false }
        }

    }
).del('/todoList/:name',
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

app.use(router.routes())
    .use(router.allowedMethods())

app.listen(3001, () => console.log('listen 3001 now'))
