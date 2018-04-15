import { OutgoingSocketEvents } from "../SocketNS";
import { Inputs } from "../index";
import { pluck } from "rxjs/operators/pluck";
import { filter } from "rxjs/operators/filter";
import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Rx";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { EffectNames } from "../Effects";

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

export function incomingScrollHandler(
    xs: Observable<IncomingPayload>,
    inputs: Inputs
) {
    return xs.pipe(
        withLatestFrom(
            inputs.option$.pipe(pluck("ghostMode", "scroll")),
            inputs.window$.pipe(pluck("location", "pathname"))
        ),
        filter(([event, canScroll, pathname]) => {
            return canScroll && event.pathname === pathname;
        }),
        map(([event]) => {
            return [EffectNames.BrowserSetScroll, event];
        })
    );
}
