import { Observable } from "rxjs/Rx";
import { Inputs } from "./index";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as Log from "./Log";
import { pluck } from "rxjs/operators/pluck";
import { tap } from "rxjs/operators/tap";
import { map } from "rxjs/operators/map";
import { getLocation } from "./utils";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { filter } from "rxjs/operators/filter";
import { ignoreElements } from "rxjs/operators/ignoreElements";

export enum Events {
    PropSet = "@@BSDOM.Events.PropSet",
    StyleSet = "@@BSDOM.Events.StyleSet",
    LinkReplace = "@@BSDOM.Events.LinkReplace",
    SetScroll = "@@BSDOM.Events.SetScroll",
    SetWindowName = "@@BSDOM.Events.SetWindowName"
}

export interface PropSetPayload {
    target: Element;
    prop: string;
    value: string;
    pathname: string;
}

export interface StyleSetPayload {
    style: string;
    styleName: string;
    value: string;
    newValue: string;
    pathName: string;
}

export function propSet(incoming: PropSetPayload): [Events.PropSet, any] {
    return [Events.PropSet, incoming];
}

export function styleSet(incoming: StyleSetPayload): [Events.StyleSet, any] {
    return [Events.StyleSet, incoming];
}

export function setWindowName(
    incoming: string
): [Events.SetWindowName, string] {
    return [Events.SetWindowName, incoming];
}

export type SetScrollPayload = { x: number; y: number };
export function setScroll(x, y): [Events.SetScroll, SetScrollPayload] {
    return [Events.SetScroll, { x, y }];
}

export type LinkReplacePayload = {
    target: HTMLLinkElement;
    nextHref: string;
    prevHref: string;
    pathname: string;
    basename: string;
};

export function linkReplace(
    incoming: LinkReplacePayload
): [Events.LinkReplace, LinkReplacePayload] {
    return [Events.LinkReplace, incoming];
}

export const domHandlers$ = new BehaviorSubject({
    [Events.PropSet](xs: Observable<PropSetPayload>) {
        return xs.pipe(
            tap(event => {
                const { target, prop, value } = event;
                target[prop] = value;
            }),
            map(e =>
                Log.consoleInfo(
                    `[PropSet]`,
                    e.target,
                    `${e.prop} = ${e.pathname}`
                )
            )
        );
    },
    [Events.StyleSet](xs: Observable<StyleSetPayload>) {
        return xs.pipe(
            tap(event => {
                const { style, styleName, newValue } = event;
                style[styleName] = newValue;
            }),
            map(e =>
                Log.consoleDebug(`[StyleSet] ${e.styleName} = ${e.pathName}`)
            )
        );
    },
    [Events.LinkReplace](xs: Observable<LinkReplacePayload>, inputs: Inputs) {
        return xs.pipe(
            withLatestFrom<LinkReplacePayload, any>(
                inputs.option$.pipe(pluck("injectNotification"))
            ),
            filter(([, inject]) => inject),
            map(([incoming, inject]) => {
                const message = `[LinkReplace] ${incoming.basename}`;
                if (inject === "overlay") {
                    return Log.overlayInfo(message);
                }
                return Log.consoleInfo(message);
            })
        );
    },
    [Events.SetScroll]: (xs, inputs: Inputs) => {
        return xs.pipe(
            withLatestFrom(inputs.window$),
            tap(([event, window]) => window.scrollTo(event.x, event.y)),
            ignoreElements()
        );
    },
    [Events.SetWindowName]: (xs, inputs: Inputs) => {
        return xs.pipe(
            withLatestFrom(inputs.window$),
            tap(([value, window]) => (window.name = value)),
            ignoreElements()
        );
    }
});
