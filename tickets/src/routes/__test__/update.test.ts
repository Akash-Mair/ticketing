import request from 'supertest'

import { app } from '../../app'
import mongoose from 'mongoose';

it('returns a 404 if the provided id soesnt exist', async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title:'Game',
            price: 89
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:'Game',
            price: 89
        })
        .expect(404)
})

it('returns a 401 if the user does not own the ticket', async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Big Game',
            price: 200
        })
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Big Game II',
            price: 202
        })
        .expect(401)

})

it('returns a 400 if the user provides an invalid title or price', async()=>{
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Big Game',
            price: 200
        })
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 42,
            price: 200
        })
        .expect(400)
})

it('updates the ticket if all inputs are valid', async()=>{
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Big Game',
            price: 200
        })
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Big Game III',
            price: 203
        })
        .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual('Big Game III')
})


