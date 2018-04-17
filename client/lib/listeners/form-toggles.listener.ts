import { IncomingSocketNames, OutgoingSocketEvent } from "../socket-messages";
import { getElementData } from "../browser.utils";
import { Observable } from "rxjs/Observable";
import { createTimedBooleanSwitch } from "../utils";
import * as FormToggleEvent from "../messages/FormToggleEvent";
import { filter } from "rxjs/operators/filter";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { map } from "rxjs/operators/map";
import { share } from "rxjs/operators/share";

export function getFormTogglesStream(
    document: Document,
    socket$
): Observable<OutgoingSocketEvent> {
    const canSync$ = createTimedBooleanSwitch(
        socket$.pipe(
            filter(([name]) => name === IncomingSocketNames.InputToggle)
        )
    );
    return inputObservable(document).pipe(
        withLatestFrom(canSync$),
        filter(([, canSync]) => canSync),
        map((incoming): OutgoingSocketEvent => {
            const keyupEvent: { target: HTMLInputElement } = incoming[0];
            const { target } = keyupEvent;
            const data = getElementData(target);

            return FormToggleEvent.outgoing(data, {
                type: target.type,
                checked: target.checked,
                value: target.value
            });
        })
    );
}

function inputObservable(document: Document) {
    return Observable.create(obs => {
        document.body.addEventListener(
            "change",
            function(event) {
                const elem = <HTMLInputElement>(event.target ||
                    event.srcElement);
                // todo(Shane): which other elements emit a change event that needs to be propagated
                if (elem.tagName === "SELECT") {
                    obs.next({ target: event.target });
                }
            },
            true
        );
    }).pipe(share());
}
