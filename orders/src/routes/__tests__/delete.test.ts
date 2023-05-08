import request from 'supertest';
import {app} from '../../app';
import {Ticket} from "../../models/ticket";
import {Order, OrderStatus} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";


it('marks an order as canceled', async () => {
    // Create a ticket Model
    const ticket = Ticket.build({
        title: 'concert',
        price: 1023
    });
    await ticket.save();

    const user = signin()
    // Make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    //expectation to make sure the thing is canceled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

});
it('if order allready cancelled', async () => {
    // Create a ticket Model
    const ticket = Ticket.build({
        title: 'concert',
        price: 1023
    });
    await ticket.save();

    const user = signin()
    // Make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    //expectation to make sure the thing is canceled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

    // make a one more request to cancel order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(404)

});
it('emits a order cancelled envent', async () => {
    // Create a ticket Model
    const ticket = Ticket.build({
        title: 'concert',
        price: 1023
    });
    await ticket.save();

    const user = signin()
    // Make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})