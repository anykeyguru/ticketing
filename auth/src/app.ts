import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// Cookies
import cookieSession from 'cookie-session';
// Router
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/singin';
import { signOutRouter } from './routes/signout';
// Errors
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

// Vars
const PORT: number = 3000;
const app = express();
app.set('trust proxy', true)

// APP
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',

    })
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };