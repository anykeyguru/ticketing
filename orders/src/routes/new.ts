import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@qptickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { deleteOrderRouter } from './delete';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes
router.post(
    '/api/orders',
    requireAuth,
    [
        body('tickedId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Ticket id MustBe provided or not Correct')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { tickedId } = req.body;

        // Find the ticket the user is trying to ordr in database
        const ticket = await Ticket.findById(tickedId);
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make shure that the ticket is not reserved
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('The ticket is aleady reserved');
        }

        // Calclulate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the DB
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        // Publish an event saying that an order is created
        res.status(201).send(order);
    });

export { router as newOrdersRouter };