import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
})

it('returns the ticket is the ticket is found', async () => {

    // Make record
    let tickets = await Ticket.find({});
    const title = "testest"
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


})

it('returns the ticket if ticket is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(
            { title, price }
        )
        .expect(201);
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);

});
