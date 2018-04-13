import { OutgoingSocketEvents } from "../SocketNS";
import * as ClickEvent from "./ClickEvent";

export interface Payload {
    tagName: string;
    index: number;
    value: any;
    type: any;
    checked: any;
}
export type OutgoingPayload = Payload;
export type IncomingPayload = Payload;
export function outgoing(
    element: ClickEvent.ElementData,
    props: { value: string; type: string; checked: boolean }
): [OutgoingSocketEvents.Toggle, OutgoingPayload] {
    return [
        OutgoingSocketEvents.Toggle,
        {
            ...element,
            ...props
        }
    ];
}
