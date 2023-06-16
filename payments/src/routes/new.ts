import express, {Request, Response} from "express";
import {body} from 'express-validator';
import {Payment} from "../models/payment";
//Commons
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorisedError, OrderStatus,
} from "@qptickets/common";
import {stripe} from "../stripe";
import {PaymentCreatedPublisher} from "../events/publishers/payment-creted-publisher";
//Models
import {Order} from "../models/order";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty(),
        body('notes')
            .optional()
            .isString()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {token, orderId, notes} = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorisedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }


        // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
        const description = notes || '';
        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token,
            description: `order: ${order.id}. ${description}`,
        });
        const paymnt = Payment.build({
            stripeId: charge.id,
            orderId: orderId
        });

        await paymnt.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: paymnt.id,
            stripeId: paymnt.stripeId,
            orderId: paymnt.orderId,
        });


        res.status(201).send({id: paymnt.id})

    });

export {router as createChargeRouter}