import { createTimedBooleanSwitch } from "../utils";
import { IncomingSocketNames, OutgoingSocketEvent } from "../socket-messages";
import { getElementData } from "../browser.utils";
import { Observable } from "rxjs/Observable";
import * as ClickEvent from "../messages/ClickEvent";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { filter } from "rxjs/operators/filter";
import { map } from "rxjs/operators/map";
import { share } from "rxjs/operators/share";
import {Inputs} from "../index";
import {mergeMap} from "rxjs/operators/mergeMap";
import {pluck} from "rxjs/operators/pluck";

export function getClickStream(
    document: Document,
    socket$: Inputs['socket$']
    , option$: Inputs['option$']): Observable<OutgoingSocketEvent> {
    const canSync$ = createTimedBooleanSwitch(
        socket$.pipe(filter(([name]) => name === IncomingSocketNames.Click))
    );

    return option$.pipe(
        pluck('ghostMode', 'clicks'),
        filter(clicks => clicks === true),
        mergeMap(() => {
            return clickObservable(document).pipe(
                withLatestFrom(canSync$),
                filter(([, canSync]) => canSync),
                map((incoming): OutgoingSocketEvent => {
                    const clickEvent: { target: HTMLElement } = incoming[0];
                    return ClickEvent.outgoing(getElementData(clickEvent.target));
                })
            );
        })
    )
}

function clickObservable(document: Document) {
    return Observable.create(obs => {
        document.body.addEventListener(
            "click",
            function(e: any) {
                if (e.target.tagName === "LABEL") {
                    const id = e.target.getAttribute("for");
                    if (id && document.getElementById(id)) {
                        return false;
                    }
                }
                obs.next({ target: e.target });
            },
            true
        );
    }).pipe(share());
}
