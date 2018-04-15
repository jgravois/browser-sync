import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Rx";
import * as Log from "../Log";

export interface IncomingPayload {
    message: string;
    timeout: number;
    override?: boolean;
}

export function incomingBrowserNotify(xs: Observable<IncomingPayload>) {
    return xs.pipe(map(event => Log.overlayInfo(event.message, event.timeout)));
}
