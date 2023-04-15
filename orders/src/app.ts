import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// Cookies
import cookieSession from 'cookie-session';
// Errors
import { errorHandler, NotFoundError, currentUser } from '@qptickets/common';
// Routers
import { indexOrdersRouter } from './routes/index';
import { newOrdersRouter } from './routes/new';
import { deleteOrderRouter } from './routes/delete';
import { showOrdersRouter } from './routes/show';
import { updateOrdersRouter } from './routes/update';

// Vars
const PORT: number = 3000;
const app = express();
app.set('trust proxy', true)

// APP
app.use(json());
// Setup cookie
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',

    })
);

// Middlewares
app.use(currentUser);

// Routers
app.use(indexOrdersRouter);
app.use(newOrdersRouter);
app.use(showOrdersRouter);
app.use(deleteOrderRouter);
app.use(updateOrdersRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };