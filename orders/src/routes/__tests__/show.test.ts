import request from 'supertest';
import {app} from '../../app';
import {Ticket} from "../../models/ticket";

it('Fetches the order by ID', async () => {

    // create ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 123
    });
    await ticket.save();

    const user = global.signin();
    // make a request to build an order with this thicket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make request to fetch the order
    const {body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(order.id);
});


it('it returns an error if one use tries to fetch anouther user order', async () => {

    // create ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 123
    });
    await ticket.save();

    const user = global.signin();
    // make a request to build an order with this thicket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);

});