import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';


it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            tickedId: ticketId
        }).expect(404);

    // expect(response.text).toEqual("posted");
});

it('returns an error if the ticket is already reserved', async () => {

    const userId = new mongoose.Types.ObjectId().toHexString();
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);


    const ticket = Ticket.build({
        title: "Concert 12",
        price: 123
    });
    await ticket.save()
    const ticketId = ticket.id;

    const order = Order.build({
        userId,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tickedId: ticketId })
        .expect(400);
    expect(response.body.errors[0].message).toEqual('The ticket is aleady reserved');
});

it('reserves a ticket', async () => {

});