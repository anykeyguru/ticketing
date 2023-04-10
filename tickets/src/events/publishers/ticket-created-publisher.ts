import { Publisher, Subjects, TicketCreatedEvent } from "@qptickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}