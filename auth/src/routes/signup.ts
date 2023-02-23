import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
// Middlewares
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be lenght between 4 and 20characters'),

    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in Use, please fill enouther One');
        }

        const user = User.build({ email, password });
        await user.save();
        // Generate JWT
        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);
        // Store it on session object
        req.session = {
            jwt: userJWT,
            service: 'Authorisation'
        };


        res.status(201).send(user);
    }
);

export { router as signUpRouter };