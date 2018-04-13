import { OutgoingSocketEvents } from "../SocketNS";
import * as ClickEvent from "./ClickEvent";

export interface Payload {
    value: any;
    tagName: string;
    index: number;
}
export type OutgoingPayload = Payload;
export type IncomingPayload = Payload;
export function outgoing(
    element: ClickEvent.ElementData,
    value: any
): [OutgoingSocketEvents.Keyup, OutgoingPayload] {
    return [
        OutgoingSocketEvents.Keyup,
        {
            ...element,
            value
        }
    ];
}
