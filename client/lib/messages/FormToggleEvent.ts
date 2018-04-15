import { OutgoingSocketEvents } from "../SocketNS";
import * as ClickEvent from "./ClickEvent";
import { Inputs } from "../index";
import { pluck } from "rxjs/operators/pluck";
import { filter } from "rxjs/operators/filter";
import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Rx";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { EffectNames } from "../Effects";
import { ignoreElements } from "rxjs/operators/ignoreElements";
import { setElementToggleValue } from "../effects/SetElementToggleValue.effect";

export interface Payload {
    tagName: string;
    index: number;
    value: any;
    type: any;
    checked: any;
}

export type OutgoingPayload = Payload;

export interface IncomingPayload extends OutgoingPayload {
    pathname: string;
}

export function outgoing(
    element: ClickEvent.ElementData,
    props: { value: string; type: string; checked: boolean }
): [OutgoingSocketEvents.InputToggle, OutgoingPayload] {
    return [
        OutgoingSocketEvents.InputToggle,
        {
            ...element,
            ...props
        }
    ];
}

export function incomingInputsToggles(
    xs: Observable<IncomingPayload>,
    inputs: Inputs
) {
    return xs.pipe(
        withLatestFrom(
            inputs.option$.pipe(pluck("ghostMode", "forms", "toggles")),
            inputs.window$.pipe(pluck("location", "pathname"))
        ),
        filter(([, toggles]) => toggles === true),
        map(([event]) => setElementToggleValue(event))
    );
}
