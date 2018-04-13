import { OutgoingSocketEvents } from "../SocketNS";

export interface ElementData {
    tagName: string;
    index: number;
}
export type OutgoingPayload = ElementData;
export type IncomingPayload = ElementData;
export function outgoing(
    data: ElementData
): [OutgoingSocketEvents.Click, ElementData] {
    return [OutgoingSocketEvents.Click, data];
}
