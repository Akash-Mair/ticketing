import { Publisher, OrderCreatedEvent, Subjects } from "@amtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated

}

