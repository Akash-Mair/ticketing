import { Publisher, Subjects, ExpirationCompleteEvent  } from "@amtickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}