import express, { Request, Response } from 'express';
import { NotFoundError } from '@qptickets/common';

const router = express.Router();

router.put('/api/orders/:orderId', async (req: Request, res: Response) => {
    res.send("updated");
});

export { router as updateOrdersRouter };