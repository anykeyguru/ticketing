import request from 'supertest';
import { app } from '../../app';


interface TicketObject {
    title: String;
    price: Number;
}

interface EnumTickets extends Array<TicketObject> { }

const createTicket = (ticket: TicketObject) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: ticket.title,
            price: ticket.price
        });
};

it('can fetch a list of tickets My Ver ', async () => {
    // const theTickets: EnumTickets = [
    //     { title: "Test 1", price: 10 },
    //     { title: "Test 2", price: 20 },
    //     { title: "Test 3", price: 30 }
    // ]
    await createTicket({ title: "Test 1", price: 10 });
    await createTicket({ title: "Test 2", price: 20 });
    await createTicket({ title: "Test 3", price: 30 });
    // theTickets.forEach(async t => {
    //     await createTicket(t);
    // })


    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);

});




