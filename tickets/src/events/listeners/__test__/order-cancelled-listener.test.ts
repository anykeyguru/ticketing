import {OrderCreatedEvent, Subjects, OrderStatus, OrderCancelledEvent} from "@qptickets/common";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
    //  create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    //    Create and save the ticket
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        userId: userId,
    });

    const orderId = new mongoose.Types.ObjectId().toHexString();
    ticket.set({orderId});
    await ticket.save();

    //    create fake data object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    };
    //    fake message
    //    @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, ticket};
}

it('update the ticket, puplishes an event, and ack the message', async () => {
    const {listener, data, msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    const updatedTickets = await Ticket.findById(ticket.id);

    expect(updatedTickets!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();

    expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();
    //RAZNICI NET
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});