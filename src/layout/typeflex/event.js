/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export var LayoutType;
(function (LayoutType) {
    LayoutType[LayoutType["kLayout"] = 0] = "kLayout";
    LayoutType[LayoutType["kMeasure"] = 1] = "kMeasure";
    LayoutType[LayoutType["kCachedLayout"] = 2] = "kCachedLayout";
    LayoutType[LayoutType["kCachedMeasure"] = 3] = "kCachedMeasure";
})(LayoutType || (LayoutType = {}));
export var LayoutPassReason;
(function (LayoutPassReason) {
    LayoutPassReason[LayoutPassReason["kInitial"] = 0] = "kInitial";
    LayoutPassReason[LayoutPassReason["kAbsLayout"] = 1] = "kAbsLayout";
    LayoutPassReason[LayoutPassReason["kStretch"] = 2] = "kStretch";
    LayoutPassReason[LayoutPassReason["kMultilineStretch"] = 3] = "kMultilineStretch";
    LayoutPassReason[LayoutPassReason["kFlexLayout"] = 4] = "kFlexLayout";
    LayoutPassReason[LayoutPassReason["kMeasureChild"] = 5] = "kMeasureChild";
    LayoutPassReason[LayoutPassReason["kAbsMeasureChild"] = 6] = "kAbsMeasureChild";
    LayoutPassReason[LayoutPassReason["kFlexMeasure"] = 7] = "kFlexMeasure";
})(LayoutPassReason || (LayoutPassReason = {}));
export class LayoutData {
    layouts;
    measures;
    maxMeasureCache;
    cachedLayouts;
    cachedMeasures;
    measureCallbacks;
    measureCallbackReasonsCount;
    constructor(layouts = 0, measures = 0, maxMeasureCache = 0, cachedLayouts = 0, cachedMeasures = 0, measureCallbacks = 0, measureCallbackReasonsCount = [0, 0, 0, 0, 0, 0, 0, 0]) {
        this.layouts = layouts;
        this.measures = measures;
        this.maxMeasureCache = maxMeasureCache;
        this.cachedLayouts = cachedLayouts;
        this.cachedMeasures = cachedMeasures;
        this.measureCallbacks = measureCallbacks;
        this.measureCallbackReasonsCount = measureCallbackReasonsCount;
    }
}
export function LayoutPassReasonToString(value) {
    switch (value) {
        case LayoutPassReason.kInitial:
            return 'initial';
        case LayoutPassReason.kAbsLayout:
            return 'abs_layout';
        case LayoutPassReason.kStretch:
            return 'stretch';
        case LayoutPassReason.kMultilineStretch:
            return 'multiline_stretch';
        case LayoutPassReason.kFlexLayout:
            return 'flex_layout';
        case LayoutPassReason.kMeasureChild:
            return 'measure';
        case LayoutPassReason.kAbsMeasureChild:
            return 'abs_measure';
        case LayoutPassReason.kFlexMeasure:
            return 'flex_measure';
        default:
            return 'unknown';
    }
}
// deviation: enum name is 'EventType' instead of 'Type' as it can't be defined
// under the class in TypeScript and the naming is vague if left as-is.
export var EventType;
(function (EventType) {
    EventType[EventType["NodeAllocation"] = 0] = "NodeAllocation";
    EventType[EventType["NodeDeallocation"] = 1] = "NodeDeallocation";
    EventType[EventType["NodeLayout"] = 2] = "NodeLayout";
    EventType[EventType["LayoutPassStart"] = 3] = "LayoutPassStart";
    EventType[EventType["LayoutPassEnd"] = 4] = "LayoutPassEnd";
    EventType[EventType["MeasureCallbackStart"] = 5] = "MeasureCallbackStart";
    EventType[EventType["MeasureCallbackEnd"] = 6] = "MeasureCallbackEnd";
    EventType[EventType["NodeBaselineStart"] = 7] = "NodeBaselineStart";
    EventType[EventType["NodeBaselineEnd"] = 8] = "NodeBaselineEnd";
})(EventType || (EventType = {}));
// deviation: class name is 'YGEvent' instead of 'Event' to prevent name clash.
export class YGEvent {
    static reset() {
        subscribers.splice(0, subscribers.length);
    }
    static subscribe(subscriber) {
        push(subscriber);
    }
    // deviation: we expect 'eventType' in the public implementation of
    // 'publish' as we can't infer 'eventType' with just 'eventData' being
    // provided as it's an interface and not a class.
    static publish(node, eventType, eventData) {
        for (const subscriber of subscribers) {
            subscriber(node, eventType, eventData);
        }
    }
}
// deviation: use a list of subscribers instead of a reverse linked list for
// tracking active subscribers to simplify implementation.
const subscribers = [];
function push(newHead) {
    let oldHead = null;
    if (subscribers.length > 0) {
        oldHead = subscribers[subscribers.length - 1];
    }
    subscribers.push(newHead);
    return oldHead;
}
//# sourceMappingURL=event.js.map