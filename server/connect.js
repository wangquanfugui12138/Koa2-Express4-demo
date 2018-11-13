const mongoose = require('mongoose')

mongoose.Promise = global.Promise//为了解决过期的问题
// /*调试模式是mongoose提供的一个非常实用的功能，用于查看mongoose模块对mongodb操作的日志，一般开发时会打开此功能，以便更好的了解和优化对mongodb的操作。*/
// mongoose.set('debug', true)

mongoose.connect('mongodb://zenyk:bf4862@ds145093.mlab.com:45093/zenyk',
    { useNewUrlParser: true },
    (err, info) => {
        if (err) throw 'mongodb connect failed'
        console.log('mongodb connect success')
    }
)
