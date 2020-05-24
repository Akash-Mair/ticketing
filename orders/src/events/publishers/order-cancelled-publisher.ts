import { Publisher, OrderCancelledEvent, Subjects } from "@amtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled

}

