import { createTimedBooleanSwitch } from "./utils";
import {
    IncomingSocketNames,
    OutgoingSocketEvent
} from "./SocketNS";
import { getElementData } from "./browser.utils";
import { Observable } from "rxjs/Observable";
import * as ClickEvent from './messages/ClickEvent';

export function getClickStream(
    document: Document,
    socket$
): Observable<OutgoingSocketEvent> {
    const canSync$ = createTimedBooleanSwitch(
        socket$.filter(([name]) => name === IncomingSocketNames.Click)
    );

    return clickObservable(document)
        .withLatestFrom(canSync$)
        .filter(([, canSync]) => canSync)
        .map((incoming): OutgoingSocketEvent => {
            const clickEvent: { target: HTMLElement } = incoming[0];
            return ClickEvent.outgoing(getElementData(clickEvent.target));
        });
}

function clickObservable(document: Document) {
    return Observable.create(obs => {
        console.log('adding click handler');
        document.body.addEventListener(
            "click",
            function(e: any) {
                obs.next({ target: e.target });
            },
            true
        );
    }).share();
}
