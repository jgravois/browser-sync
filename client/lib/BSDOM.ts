import { Observable } from "rxjs/Rx";
import { Inputs } from "./index";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as Log from "./Log";

export enum Events {
    PropSet = "@@BSDOM.Events.PropSet",
    StyleSet = "@@BSDOM.Events.StyleSet",
    LinkReplace = "@@BSDOM.Events.LinkReplace",
    SetScroll = "@@BSDOM.Events.SetScroll",
    SetWindowName = "@@BSDOM.Events.SetWindowName"
}

export function propSet(incoming): [Events.PropSet, any] {
    return [Events.PropSet, incoming];
}

export function styleSet(incoming): [Events.StyleSet, any] {
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
    [Events.PropSet](xs) {
        return xs
            .do(event => {
                const { target, prop, value } = event;
                target[prop] = value;
            })
            .map(e =>
                Log.consoleInfo(
                    `[PropSet]`,
                    e.target,
                    `${e.prop} = ${e.pathname}`
                )
            );
    },
    [Events.StyleSet](xs) {
        return xs
            .do(event => {
                const { style, styleName, newValue, pathName } = event;
                style[styleName] = newValue;
            })
            .map(e =>
                Log.consoleDebug(`[StyleSet] ${e.styleName} = ${e.pathName}`)
            );
    },
    [Events.LinkReplace](
        xs: Observable<LinkReplacePayload>,
        inputs: Inputs
    ) {
        return xs
            .withLatestFrom<LinkReplacePayload, any>(
                inputs.option$.pluck("injectNotification")
            )
            .filter(([, inject]) => inject)
            .map(([incoming, inject]) => {
                const message = `[LinkReplace] ${incoming.basename}`;
                if (inject === "overlay") {
                    return Log.overlayInfo(message);
                }
                return Log.consoleInfo(message);
            });
    },
    [Events.SetScroll]: (xs, inputs: Inputs) => {
        return xs
            .withLatestFrom(inputs.window$)
            .do(([event, window]) => window.scrollTo(event.x, event.y))
            .ignoreElements();
    },
    [Events.SetWindowName]: (xs, inputs: Inputs) => {
        return xs
            .withLatestFrom(inputs.window$)
            .do(([value, window]) => (window.name = value))
            .ignoreElements();
    }
});
