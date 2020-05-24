import mongoose from 'mongoose'

import {app} from './app'
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';


const start = async () => {
    if (!process.env.jwt) throw new Error('JWT key must be defined')
    if (!process.env.MONGO_URI) throw new Error('Mongo Uri must be defined')
    if (!process.env.NATS_CLUSTER_ID) throw new Error('Nats cluster id needs to be defined')
    if (!process.env.NATS_CLIENT_ID) throw new Error('Nats client id needs to be defined')
    if (!process.env.NATS_URL) throw new Error('Nats url needs to be defined')

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed')
            process.exit()
        })

        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()

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