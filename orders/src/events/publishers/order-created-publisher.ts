import {OrderCreatedEvent, Publisher, Subjects} from "@qptickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}