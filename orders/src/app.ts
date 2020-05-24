import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'
import cookieSession from 'cookie-session'
import { errorhandler, NotFoundError, currentUser } from '@amtickets/common';

import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';



const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' 
    })
)
app.use(currentUser)

app.use(deleteOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)


app.all('*', async () => 
    {throw new NotFoundError()})
app.use(errorhandler)

export {app}