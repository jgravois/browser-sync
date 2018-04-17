import {createTimedBooleanSwitch} from "../utils";
import {IncomingSocketNames, OutgoingSocketEvent} from "../socket-messages";
import {
    getScrollPosition,
    getScrollPositionForElement
} from "../browser.utils";
import {Observable} from "rxjs/Observable";
import * as ScrollEvent from "../messages/ScrollEvent";
import {filter} from "rxjs/operators/filter";
import {map} from "rxjs/operators/map";
import {withLatestFrom} from "rxjs/operators/withLatestFrom";
import {share} from "rxjs/operators/share";
import {Inputs} from "../index";
import {pluck} from "rxjs/operators/pluck";
import {mergeMap} from "rxjs/operators/mergeMap";
import {switchMap} from "rxjs/operators/switchMap";
import {empty} from "rxjs/observable/empty";
import {tap} from "rxjs/operators/tap";

export function getScrollStream(
    window: Window,
    document: Document,
    socket$: Inputs['socket$'], option$: Inputs['option$']): Observable<OutgoingSocketEvent> {

    const canSync$ = createTimedBooleanSwitch(
        socket$.pipe(filter(([name]) => name === IncomingSocketNames.Scroll))
    );

    return option$.pipe(
        pluck('ghostMode', 'scroll'),
        switchMap((scroll) => {
            if (!scroll) return empty();
            return scrollObservable(window, document).pipe(
                withLatestFrom(canSync$),
                filter(([, canSync]) => canSync),
                map((incoming): OutgoingSocketEvent => {
                    const scrollEvent: { target: HTMLElement } = incoming[0];
                    const {target} = scrollEvent;

                    if ((target as any) === document) {
                        return ScrollEvent.outgoing(
                            getScrollPosition(window, document),
                            "document",
                            0
                        );
                    }

                    const elems = document.getElementsByTagName(target.tagName);
                    const index = Array.prototype.indexOf.call(elems || [], target);

                    return ScrollEvent.outgoing(
                        getScrollPositionForElement(target),
                        target.tagName,
                        index
                    );
                })
            )
        })
    );
}

export function scrollObservable(
    window,
    document
): Observable<{ target: any }> {
    return Observable.create(obs => {
        console.log('init scroll');
        function handler(e) {
            obs.next({target: e.target});
        }
        document.addEventListener("scroll", handler, true);
        return () => {
            console.log('dispose scroll');
            document.removeEventListener("scroll", handler);
        }
    });
}
