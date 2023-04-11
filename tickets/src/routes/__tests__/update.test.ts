import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('retuns a 404 if the provided id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send(
            { title: 'some title', price: 20 }
        )
        .expect(404);

});

it('retuns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send(
            { title: 'some title', price: 20 }
        )
        .expect(401);

});

it('returns a 401 if the user does not own the ticket', async () => {
    // Create ticket
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: "some title",
            price: 20
        })
        .expect(201);



    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send(
            { title: 'some title 2', price: 22 }
        )
        .expect(401);

});

it('retuns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    // Create ticket
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: "some title",
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "",
            price: 25
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "some title +",
            price: -10
        })
        .expect(400);

});

it('updates the ticket provided valid inputse', async () => {

    const cookie = global.signin();
    // Create ticket
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: "some title",
            price: 20
        })
        .expect(201);
    // Update ticket
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "new title +",
            price: 100
        })
        .expect(200);

    // Make single non authorised request by ticke ID
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new title +');
    expect(ticketResponse.body.price).toEqual(100);
});