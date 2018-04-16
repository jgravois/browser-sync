import { merge } from "rxjs/observable/merge";
import { getFormInputStream } from "./outgoing.form-inputs";
import { getClickStream } from "./outgoing.clicks";
import { getScrollStream } from "./outgoing.scroll";
import { getFormTogglesStream } from "./outgoing.form-toggles";
import { OutgoingSocketEvent } from "./socket-messages";
import { Observable } from "rxjs/Observable";
import {Inputs} from "./index";

export function initOutgoing(
    window: Window,
    document: Document,
    socket$: Inputs['socket$'],
    option$: Inputs['option$'],
): Observable<OutgoingSocketEvent> {
    const merged$ = merge(
        getScrollStream(window, document, socket$, option$),
        getClickStream(document, socket$, option$),
        getFormInputStream(document, socket$),
        getFormTogglesStream(document, socket$)
    );

    return merged$;
}
