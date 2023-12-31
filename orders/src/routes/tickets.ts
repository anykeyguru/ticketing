import express, {Request, Response} from 'express';
import {NotAuthorisedError, NotFoundError, requireAuth} from "@qptickets/common";
import {Order} from "../models/order";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.get(
    '/api/orders/tickets',
    requireAuth,
    async (req: Request, res: Response) => {
        const tickets = await Ticket.find({});
        if (!tickets) {
            throw new NotFoundError();
        }
        res.send(tickets);
    });

export {router as showTicketsRouter};