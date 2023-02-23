import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
// Middlewares
import { validateRequest } from '../middlewares/validate-request';
// User
import { User } from "../models/user";
// Errors
import { BadRequestError } from '../errors/bad-request-error';
// Services
import { Password } from '../services/password';

const router = express.Router();

interface User {
    user: string;
    password: string;
}

router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Fill the password, please'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Sorry, invalid Credentials');
        }

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) {
            throw new BadRequestError('Sorry, invalid Credentials');
        }

        // Generate JWT
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: userJWT,
            service: 'Authorisation'
        };


        res.status(201).send(existingUser);
    });

export { router as signInRouter };