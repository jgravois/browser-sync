import { IncomingSocketNames, OutgoingSocketEvent } from "../socket-messages";
import { getElementData } from "../browser.utils";
import { Observable } from "rxjs/Observable";
import { createTimedBooleanSwitch } from "../utils";
import * as KeyupEvent from "../messages/KeyupEvent";
import { filter } from "rxjs/operators/filter";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { map } from "rxjs/operators/map";
import { share } from "rxjs/operators/share";

export function getFormInputStream(
    document: Document,
    socket$
): Observable<OutgoingSocketEvent> {
    const canSync$ = createTimedBooleanSwitch(
        socket$.pipe(filter(([name]) => name === IncomingSocketNames.Keyup))
    );
    return inputObservable(document).pipe(
        withLatestFrom(canSync$),
        filter(([, canSync]) => canSync),
        map((incoming): OutgoingSocketEvent => {
            const keyupEvent: { target: HTMLInputElement } = incoming[0];
            const target = getElementData(keyupEvent.target);
            const value = keyupEvent.target.value;

            return KeyupEvent.outgoing(target, value);
        })
    );
}

function inputObservable(document: Document) {
    return Observable.create(obs => {
        document.body.addEventListener(
            "keyup",
            function(event) {
                const elem = <HTMLInputElement>(event.target ||
                    event.srcElement);
                if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
                    obs.next({ target: event.target });
                }
            },
            true
        );
    }).pipe(share());
}
