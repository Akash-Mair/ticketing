import mongoose from 'mongoose'

import {app} from './app'
import { natsWrapper } from './nats-wrapper';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

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

        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        new PaymentCreatedListener(natsWrapper.client).listen()

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