import { OutgoingSocketEvents } from "../SocketNS";

export interface ICoords {
    x: number;
    y: number;
}
export interface Data {
    raw: ICoords;
    proportional: number;
}
export interface OutgoingPayload {
    position: Data;
    tagName: string;
    index: number;
}
export interface IncomingPayload {
    position: Data;
    tagName: string;
    index: number;
    override?: boolean;
    pathname: string;
}
export function outgoing(
    data: Data,
    tagName: string,
    index: number
): [OutgoingSocketEvents.Scroll, OutgoingPayload] {
    return [OutgoingSocketEvents.Scroll, { position: data, tagName, index }];
}
