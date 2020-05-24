import mongoose from 'mongoose'

import {app} from './app'

const start = async () => {
    if (!process.env.jwt) throw new Error('JWT key must be defined')
    if (!process.env.MONGO_URI) throw new Error('Mongo uri must be defined')

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true 
        })
    }
    catch (err) {
        console.log(err)
    }
    app.listen(3000,
        () => console.log('running on port 3000 yoo hoo mooo!!!!'))
}

start()