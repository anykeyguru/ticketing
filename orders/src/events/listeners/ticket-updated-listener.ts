import {Message} from "node-nats-streaming";
import {Subjects, Listener, TicketUpdatedEvent, NotFoundError} from "@qptickets/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        //For sel made versioning: see on ticket model snipet
        // const {title, price, version} = data;
        // ticket.set({title, price, version});
        // await ticket.save();
        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }
}
