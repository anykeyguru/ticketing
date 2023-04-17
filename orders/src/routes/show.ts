import express, { Request, Response } from 'express';
import { NotFoundError } from '@qptickets/common';

const router = express.Router();

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    res.send(req.params.orderId);
});

export { router as showOrdersRouter };