import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request  from 'supertest';
import jwt from 'jsonwebtoken'

import { app } from '../app'

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[]
        }
    }
}

let mongo: any 

jest.mock('../nats-wrapper')

beforeAll( async () => {
    process.env.jwt = 'dfghj'
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach( async () => {
    const collections = await mongoose.connection.db.collections()

    for ( let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll( async () => {
    await mongo.stop()
    await mongoose.connection.close()

})

global.signin = () => {
    const payload = {
        email: 'test@test.com',
        id: mongoose.Types.ObjectId().toHexString()
    }

    const token = jwt.sign(payload, process.env.jwt!)
    
    const session = {jwt: token}

    const sessionJSON = JSON.stringify(session)

    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`express:sess=${base64}`]

}