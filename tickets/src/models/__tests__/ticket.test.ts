import {Ticket} from "../ticket";
import mongoose from "mongoose";
import DoneCallback = jest.DoneCallback;

it('implemets optimistic concurrency control', async () => {
    // create an instanse of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: new mongoose.Types.ObjectId().toHexString()
    });

    // Save the ticket to database
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error

    try {
        await secondInstance!.save();
    } catch (e) {
        return;
    }
    throw new Error('Shouldnot reach this pont');
});

it('increments the versions number on multiple save', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});