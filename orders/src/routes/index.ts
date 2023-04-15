import express, { Request, Response } from 'express';
import { NotFoundError } from '@qptickets/common';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
    res.send("hello");
});

export { router as indexOrdersRouter };