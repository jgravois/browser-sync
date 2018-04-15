import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { setOptionsEffect } from "./effects/SetOptions.effect";
import { fileReloadEffect } from "./effects/FileReload.effect";
import { browserReloadEffect } from "./effects/BrowserReload.effect";
import { browserSetLocationEffect } from "./effects/BrowserSetLocation.effect";
import { simulateClickEffect } from "./effects/SimulateClick.effect";
import { setElementValueEffect } from "./effects/SetElementValue.effect";
import { setElementToggleValueEffect } from "./effects/SetElementToggleValue.effect";
import { pluck } from "rxjs/operators/pluck";
import { ignoreElements } from "rxjs/operators/ignoreElements";
import { merge } from "rxjs/observable/merge";
import { tap } from "rxjs/operators/tap";
import { IncomingPayload } from "./messages/ScrollEvent";
import { Inputs } from "./index";
import { Observable } from "rxjs/Observable";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { getDocumentScrollSpace } from "./browser.utils";
import { setScrollEffect } from "./effects/SetScroll";

export enum EffectNames {
    FileReload = "@@FileReload",
    PreBrowserReload = "@@PreBrowserReload",
    BrowserReload = "@@BrowserReload",
    BrowserSetLocation = "@@BrowserSetLocation",
    BrowserSetScroll = "@@BrowserSetScroll",
    SetOptions = "@@SetOptions",
    SimulateClick = "@@SimulateClick",
    SetElementValue = "@@SetElementValue",
    SetElementToggleValue = "@@SetElementToggleValue"
}

export const effectOutputHandlers$ = new BehaviorSubject({
    [EffectNames.SetOptions]: setOptionsEffect,
    [EffectNames.FileReload]: fileReloadEffect,
    [EffectNames.BrowserReload]: browserReloadEffect,
    [EffectNames.BrowserSetLocation]: browserSetLocationEffect,
    [EffectNames.SimulateClick]: simulateClickEffect,
    [EffectNames.SetElementValue]: setElementValueEffect,
    [EffectNames.SetElementToggleValue]: setElementToggleValueEffect,
    [EffectNames.BrowserSetScroll]: setScrollEffect
});
