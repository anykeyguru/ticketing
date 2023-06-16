import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
// Cookies
import cookieSession from 'cookie-session';
// Errors
import {errorHandler, NotFoundError, currentUser} from '@qptickets/common';
// Routers
import {createChargeRouter} from "./routes/new";

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
app.use(createChargeRouter);


app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};