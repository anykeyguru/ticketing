import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';

import {natsWrapper} from '../../nats-wrapper';


it('has a route hanler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404)
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);

});

it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        //Pass cookie with jwt generated in tests/setup.ts
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401)
});

it('it returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10,
        })
        .expect(400);
});

it('returns an error if invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'testest',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'testest',
        })
        .expect(400);
});

it('create a ticket with valid inputs', async () => {
    // Check if DB empty
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const title = "testest"
    // Make record
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: 20
        })
        .expect(201);

    // check if record is exists
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
});


it('publishes an event', async () => {
    const title = "testest"
    // Make record
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: 20
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});