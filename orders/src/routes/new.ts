import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@qptickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth,
    [
        body('tickedId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Ticket id MustBe provided or not Correct'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        res.send("posted");
    });

export { router as newOrdersRouter };