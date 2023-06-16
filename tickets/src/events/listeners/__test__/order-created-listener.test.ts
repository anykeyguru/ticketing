import {OrderCreatedEvent, Subjects, OrderStatus} from "@qptickets/common";
import {natsWrapper} from "../../../nats-wrapper";
import {OrderCreatedListener} from "../order-created-listener";
import {Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

const setup = async () => {
    //  create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    //    Create and save the ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
    //    create fake data object
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'sdfasdf',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    //    fake message
    //    @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, ticket}
}

it('set the userId of the ticket', async () => {
    const {listener, data, msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});
it('ack is handled', async () => {
    const {listener, data, msg} = await setup();

    try {
        await listener.onMessage(data, msg);
    } catch (e) {

    }

    expect(msg.ack).toHaveBeenCalled()
});


it('publishers a ticket update event', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    console.log((natsWrapper.client.publish as jest.Mock).mock.calls)
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(data.id).toEqual(ticketUpdatedData.orderId)

})