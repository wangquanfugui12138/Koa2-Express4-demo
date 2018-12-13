require('./db')
const fs = require('fs')
const path = require('path')
const express = require('express')
const Todo = require('./db').Todo
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({ dest: '/src/upload' })
const archiver = require('archiver')

const app = new express()
const whiteList = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']

const allowCrossDomain = (req, res, next) => {
    if (whiteList.indexOf(req.headers.origin) >= 0) {
        res.header('Access-Control-Allow-Origin', req.headers.origin)
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,anonymous')
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header("Access-Control-Max-Age", "3600")
    }
    next()
}

app.use(allowCrossDomain)
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/', express.static(
        path.join(__dirname, '..', '/build/')
    ))
    .use((req, res, next) => {
        console.log(`接收到${req.method}方法，请求域名为${req.headers.origin}，请求地址为${req.url}`)
        next()
    })

app.all('*',
    (req, res, next) => {
        if (req.method === "OPTIONS") {
            res.status(200)
            res.end()
        } else {
            next()
        }
    }
).get('/downloadFile/:name',
    (req, res) => {
        const filePath = `src/assets/upload/files/${req.params.name}`
        if (fs.existsSync(filePath)) {
            res.download(filePath)
        } else {
            res.json({ err: 'file is not exist', success: false })
        }
    }
).get('/downloadImg/:name',
    (req, res) => {
        const filePath = `src/assets/upload/imgs/${req.params.name}`
        if (fs.existsSync(filePath)) {
            res.download(filePath)
        } else {
            res.json({ err: 'file is not exist', success: false })
        }
    }
).get('/batchDownload',
    async (req, res) => {
        const list = [{ name:'1.jpg',path: 'src/assets/upload/imgs/1.jpg' }, { name:'1.csv',path: 'src/assets/upload/files/1.csv' }, { name:'2.png',path: 'src/assets/upload/imgs/2.png' }];
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
        setTimeout(() => {
            res.download(zipPath)
        }, 0);
        
    }
).post('/upload', upload.any(),
    (req, res, next) => {
        try {
            const files = req.files
            console.log(files)
            files.length ?
                files.forEach(file =>
                    fs
                        .createReadStream(file.path)
                        .pipe(fs.createWriteStream(`${file.mimetype.indexOf('image') >= 0 ? 'src/assets/upload/imgs' : 'src/assets/upload/files'}/${file.originalname}`))
                ) :
                fs
                    .createReadStream(files.path)
                    .pipe(fs.createWriteStream(`${files.mimetype.indexOf('image') >= 0 ? 'src/assets/upload/imgs' : 'src/assets/upload/files'}/${files.originalname}`))

            res.json({ err: 'upload success', success: false })
        } catch (e) {
            res.json({ err: 'upload failed', success: false })
        }
    }
).get('/todoList',
    async (req, res, next) => {
        try {
            let data = await Todo.find({})
            res.json({ data, success: true })
        } catch (e) {
            res.json({ data: [], success: false })
        }

    },
).get('/todoList/:name',
    async (req, res, next) => {
        const params = { name: { $regex: new RegExp(`${req.params.name}`) } }

        try {
            let data = await Todo.find(params)
            res.json({ data, success: true })
        } catch (e) {
            res.json({ data: [], success: false })
        }
    }
).post('/todoList',
    async (req, res, next) => {
        const todo = new Todo({ ...req.body })
        try {
            let data = await todo.save()
            res.json({ data, success: true })
        } catch (err) {
            res.json({ data: { err }, success: false })
        }

    }
).delete('/todoList/:name',
    async (req, res, next) => {
        const params = { name: req.params.name }
        try {
            let data = await Todo.findOneAndDelete(params)
            res.json({ data, success: true })
        } catch (err) {
            res.json({ data: { err }, success: false })
        }
    }
).get('/out',
    (req, res, next) => {
        res.redirect(301, '/index');
    }
).get('/*', function (req, res) {
    const staticPath = path.join(__dirname, '..', '/build/index.html')
    res.sendFile(staticPath)
})
app.listen(3001, () => console.log('listen 3001 now'))
