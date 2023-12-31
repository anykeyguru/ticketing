import express, {Request, Response, Router} from 'express';
import {Ticket} from '../models/ticket';
import {NotFoundError} from '@qptickets/common';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: {$exists: false}
    });
    res.send(tickets);
});

export {router as indexTicketRouter};