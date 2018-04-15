import {Inputs} from "../index";
import {Observable} from "rxjs/Observable";
import {ignoreElements} from "rxjs/operators/ignoreElements";
import {tap} from "rxjs/operators/tap";
import {EffectNames} from "../Effects";

/**
 * Set the local client options
 * @param xs
 * @param inputs
 */
export function setOptionsEffect(xs: Observable<IBrowserSyncOptions>, inputs: Inputs) {
    return xs.pipe(
        tap(options => inputs.option$.next(options))
        , ignoreElements()
    )
}

export function setOptions(options: IBrowserSyncOptions) {
    return [EffectNames.SetOptions, options];
}
