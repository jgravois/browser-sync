import { IncomingPayload } from "../messages/ScrollEvent";
import { Inputs } from "../index";
import { pluck } from "rxjs/operators/pluck";
import { Observable } from "rxjs/Observable";
import { ignoreElements } from "rxjs/operators/ignoreElements";
import { merge } from "rxjs/observable/merge";
import { getDocumentScrollSpace } from "../browser.utils";
import { tap } from "rxjs/operators/tap";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";

export function setScrollEffect(
    xs: Observable<IncomingPayload>,
    inputs: Inputs
) {
    {
        const [document$, element$] = xs
            .pipe(
                withLatestFrom(
                    inputs.window$,
                    inputs.document$,
                    inputs.option$.pipe(pluck("scrollProportionally"))
                )
            )
            .partition(([event]) => {
                return event.tagName === "document";
            });

        return merge(
            /**
             * Main window scroll
             */
            document$.pipe(
                tap(incoming => {
                    const event = incoming[0];
                    const window = incoming[1];
                    const document = incoming[2];
                    const scrollProportionally = incoming[3];
                    const scrollSpace = getDocumentScrollSpace(document);

                    if (scrollProportionally) {
                        return window.scrollTo(
                            0,
                            scrollSpace.y * event.position.proportional
                        ); // % of y axis of scroll to px
                    }
                    return window.scrollTo(0, event.position.raw.y);
                })
            ),
            /**
             * Element scrolls
             */
            element$.pipe(
                tap(incoming => {
                    const event = incoming[0];
                    const document = incoming[2];
                    const scrollProportionally = incoming[3];

                    const matchingElements = document.getElementsByTagName(
                        event.tagName
                    );
                    if (matchingElements && matchingElements.length) {
                        const match = matchingElements[event.index];
                        if (match) {
                            if (scrollProportionally) {
                                return match.scrollTo(
                                    0,
                                    match.scrollHeight *
                                        event.position.proportional
                                ); // % of y axis of scroll to px
                            }
                            return match.scrollTo(0, event.position.raw.y);
                        }
                    }
                })
            )
        ).pipe(ignoreElements());
    }
}
