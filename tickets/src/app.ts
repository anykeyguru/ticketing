import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// Cookies
import cookieSession from 'cookie-session';
// Errors
import { errorHandler, NotFoundError, currentUser } from '@qptickets/common';
// Routers
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };