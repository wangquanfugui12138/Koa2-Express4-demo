const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect('mongodb://zenyk:bf4862@ds145093.mlab.com:45093/zenyk',
    { useNewUrlParser: true },
    (err, info) => {
        if (err) throw 'mongodb connect failed'
        console.log('mongodb connect success')
    }
)
