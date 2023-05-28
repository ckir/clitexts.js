// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/Yoga.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/Yoga.cpp
import { YGUnit, YGEdge, YGNodeType, YGFlexDirection, YGAlign, YGMeasureMode, YGLogLevel, YGDirection, YGJustify, YGPositionType, YGWrap, YGOverflow, YGDisplay, YGDimension, YGExperimentalFeature, YGMeasureModeCount, } from './enums.js';
import { YGNode } from './ygnode.js';
import { YGConfig } from './ygconfig.js';
import { YGLayout } from './yglayout.js';
import { YGFloatOptional } from './ygfloatoptional.js';
import { YGUndefined, YGValue, YGValueAuto, YGValueUndefined } from './ygvalue.js';
import { YGFloatSanitize, YGFlexDirectionIsColumn, YGResolveValue, YGFlexDirectionIsRow, YGFloatMax, YGResolveFlexDirection, YGFloatOptionalMax, YGFlexDirectionCross, YGFloatMin, YGCollectFlexItemsRowValues, YGFloatsEqual, throwLogicalErrorWithMessage, } from './utils.js';
import { kDefaultFlexGrow, kWebDefaultFlexShrink, kDefaultFlexShrink, pos, trailing, leading, dim, YG_MAX_CACHED_RESULT_COUNT, } from './internal.js';
import { Log } from './log.js';
import { EventType, LayoutData, LayoutPassReason, LayoutType, YGEvent } from './event.js';
export class YGSize {
    width;
    height;
}
function formatToString(format, args) {
    let ret = format;
    for (const arg of args[0][0]) {
        ret = ret.replace(/%[d|s|f]/, arg);
    }
    return ret;
}
function YGDefaultLog(config, node, level, format, ...args) {
    switch (level) {
        case YGLogLevel.Error:
        case YGLogLevel.Fatal:
            return console.error(formatToString(format, args));
        case YGLogLevel.Warn:
        case YGLogLevel.Info:
        case YGLogLevel.Debug:
        case YGLogLevel.Verbose:
        default:
            return console.log(formatToString(format, args));
    }
}
export function YGFloatIsUndefined(value) {
    if (value === undefined || isNaN(value)) {
        return true;
    }
    return false;
    // return value >= 10E8 || value <= -10E8;
}
export function YGComputedEdgeValue(edges, edge, defaultValue) {
    if (edges[edge].unit != YGUnit.Undefined) {
        return edges[edge];
    }
    if ((edge == YGEdge.Top || edge == YGEdge.Bottom) && edges[YGEdge.Vertical].unit != YGUnit.Undefined) {
        return edges[YGEdge.Vertical];
    }
    if ((edge == YGEdge.Left || edge == YGEdge.Right || edge == YGEdge.Start || edge == YGEdge.End) &&
        edges[YGEdge.Horizontal].unit != YGUnit.Undefined) {
        return edges[YGEdge.Horizontal];
    }
    if (edges[YGEdge.All].unit != YGUnit.Undefined) {
        return edges[YGEdge.All];
    }
    if (edge == YGEdge.Start || edge == YGEdge.End) {
        return YGValueUndefined();
    }
    return defaultValue;
}
export function YGNodeGetContext(node) {
    return node.getContext();
}
export function YGNodeSetContext(node, context) {
    return node.setContext(context);
}
export function YGNodeSetMeasureFunc(node, measureFunc) {
    node.setMeasureFunc(measureFunc);
}
export function YGNodeSetBaselineFunc(node, baselineFunc) {
    node.setBaseLineFunc(baselineFunc);
}
export function YGNodeGetDirtiedFunc(node) {
    return node.getDirtied();
}
export function YGNodeSetDirtiedFunc(node, dirtiedFunc) {
    node.setDirtiedFunc(dirtiedFunc);
}
export function YGNodeSetPrintFunc(node, printFunc) {
    node.setPrintFunc(printFunc);
}
export function YGNodeGetHasNewLayout(node) {
    return node.getHasNewLayout();
}
export function YGNodeSetHasNewLayout(node, hasNewLayout) {
    node.setHasNewLayout(hasNewLayout);
}
export function YGNodeGetNodeType(node) {
    return node.getNodeType();
}
export function YGNodeSetNodeType(node, nodeType) {
    node.setNodeType(nodeType);
}
export function YGNodeIsDirty(node) {
    return node.isDirty();
}
export function YGNodeLayoutGetDidUseLegacyFlag(node) {
    return node.didUseLegacyFlag();
}
export function YGNodeMarkDirtyAndPropogateToDescendants(node) {
    node.markDirtyAndPropogateDownwards();
}
let gConfigInstanceCount = 0;
export function YGNodeNewWithConfig(config) {
    const node = new YGNode(config);
    YGEvent.publish(node, EventType.NodeAllocation, { config });
    return node;
}
export function YGConfigGetDefault() {
    return YGConfigNew();
}
export function YGNodeNew() {
    return YGNodeNewWithConfig(YGConfigGetDefault());
}
export function YGNodeClone(oldNode) {
    const node = new YGNode(oldNode);
    YGEvent.publish(node, EventType.NodeAllocation, { config: node.getConfig() });
    node.setOwner(null);
    return node;
}
export function YGConfigClone(oldConfig) {
    const config = new YGConfig(oldConfig.logger);
    gConfigInstanceCount++;
    return config;
}
export function YGNodeDeepClone(oldNode) {
    const config = YGConfigClone(oldNode.getConfig());
    const node = new YGNode(oldNode);
    node.setConfig(config);
    node.setOwner(null);
    YGEvent.publish(node, EventType.NodeAllocation, { config: node.getConfig() });
    const vec = [];
    let childNode = null;
    for (const item of oldNode.getChildren()) {
        childNode = YGNodeDeepClone(item);
        childNode.setOwner(node);
        vec.push(childNode);
    }
    node.setChildren(vec);
    return node;
}
export function YGNodeFree(node) {
    const owner = node.getOwner();
    if (owner != null) {
        owner.removeChild(node);
        node.setOwner(null);
    }
    const childCount = YGNodeGetChildCount(node);
    for (let i = 0; i < childCount; i++) {
        const child = YGNodeGetChild(node, i);
        child.setOwner(null);
    }
    node.clearChildren();
    YGEvent.publish(node, EventType.NodeDeallocation, { config: node.getConfig() });
}
export function YGConfigFreeRecursive(root) {
    if (root.getConfig() != null) {
        gConfigInstanceCount--;
        root.setConfig(null);
    }
    for (const child of root.getChildren()) {
        YGConfigFreeRecursive(child);
    }
}
export function YGNodeFreeRecursiveWithCleanupFunc(root, cleanup) {
    let skipped = 0;
    while (YGNodeGetChildCount(root) > skipped) {
        const child = YGNodeGetChild(root, skipped);
        if (child.getOwner() != root) {
            // Don't free shared nodes that we don't own.
            skipped += 1;
        }
        else {
            YGNodeRemoveChild(root, child);
            YGNodeFreeRecursive(child);
        }
    }
    if (cleanup != null) {
        cleanup(root);
    }
    YGNodeFree(root);
}
export function YGNodeFreeRecursive(root) {
    return YGNodeFreeRecursiveWithCleanupFunc(root, null);
}
export function YGNodeReset(node) {
    return node.reset();
}
export function YGConfigGetInstanceCount() {
    return gConfigInstanceCount;
}
export function YGConfigNew() {
    const config = new YGConfig(YGDefaultLog);
    gConfigInstanceCount++;
    return config;
}
export function YGConfigFree(config) {
    gConfigInstanceCount--;
}
export function YGConfigCopy(dest, src) {
    Object.assign(dest, src);
}
export function YGNodeSetIsReferenceBaseline(node, isReferenceBaseline) {
    if (node.isReferenceBaseline() != isReferenceBaseline) {
        node.setIsReferenceBaseline(isReferenceBaseline);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeIsReferenceBaseline(node) {
    return node.isReferenceBaseline();
}
export function YGNodeInsertChild(owner, child, index) {
    YGAssertWithNode(owner, child.getOwner() == null, 'Child already has a owner, it must be removed first.');
    YGAssertWithNode(owner, !owner.hasMeasureFunc(), 'Cannot add child: Nodes with measure functions cannot have children.');
    owner.insertChildIndex(child, index);
    child.setOwner(owner);
    owner.markDirtyAndPropogate();
}
export function YGNodeRemoveChild(owner, excludedChild) {
    if (YGNodeGetChildCount(owner) == 0) {
        // This is an empty set. Nothing to remove.
        return;
    }
    // Children may be shared between parents, which is indicated by not having
    // an owner. We only want to reset the child completely if it is owned
    // exclusively by one node.
    const childOwner = excludedChild.getOwner();
    if (owner.removeChild(excludedChild)) {
        if (owner == childOwner) {
            excludedChild.setLayout(new YGLayout()); // layout is no longer valid
            excludedChild.setOwner(null);
        }
        owner.markDirtyAndPropogate();
    }
}
export function YGNodeRemoveAllChildren(owner) {
    const childCount = YGNodeGetChildCount(owner);
    if (childCount == 0) {
        return;
    }
    const firstChild = YGNodeGetChild(owner, 0);
    if (firstChild.getOwner() == owner) {
        for (let i = 0; i < childCount; i++) {
            const oldChild = YGNodeGetChild(owner, i);
            oldChild.setLayout(new YGLayout()); // new YGNode().getLayout()
            oldChild.setOwner(null);
        }
        owner.clearChildren();
        owner.markDirtyAndPropogate();
        return;
    }
    owner.setChildren([]);
    owner.markDirtyAndPropogate();
}
export function YGNodeSetChildrenInternal(owner, children) {
    if (!owner) {
        return;
    }
    const ownerChildren = owner.getChildren();
    if (children.length == 0) {
        if (ownerChildren.length > 0) {
            for (let i = 0; i < ownerChildren.length; i++) {
                const child = ownerChildren[i];
                child.setLayout(new YGLayout());
                child.setOwner(null);
            }
            owner.setChildren([]);
            owner.markDirtyAndPropogate();
        }
    }
    else {
        if (ownerChildren.length > 0) {
            for (let i = 0; i < ownerChildren.length; i++) {
                const oldChild = ownerChildren[i];
                if (children.indexOf(oldChild) < 0) {
                    oldChild.setLayout(new YGLayout());
                    oldChild.setOwner(null);
                }
            }
        }
        owner.setChildren(children);
        for (let i = 0; i < children.length; i++) {
            children[i].setOwner(owner);
        }
        owner.markDirtyAndPropogate();
    }
}
/*function YGNodeSetChildren(owner: YGNode, c: Array<YGNode>, count: number) {
    YGVector children = { c, c + count };
    YGNodeSetChildrenInternal(owner, children);
}*/
export function YGNodeSetChildren(owner, children) {
    YGNodeSetChildrenInternal(owner, children);
}
export function YGNodeGetChild(node, index) {
    const children = node.getChildren();
    if (index < children.length) {
        return children[index];
    }
    return null;
}
export function YGNodeGetChildCount(node) {
    return node.getChildrenCount();
}
export function YGNodeGetOwner(node) {
    return node.getOwner();
}
export function YGNodeGetParent(node) {
    return node.getOwner();
}
export function YGNodeMarkDirty(node) {
    YGAssertWithNode(node, node.hasMeasureFunc(), 'Only leaf nodes with custom measure functions should manually mark themselves as dirty');
    node.markDirtyAndPropogate();
}
export function YGNodeCopyStyle(dstNode, srcNode) {
    if (!dstNode.getStyle().isEqual(srcNode.getStyle())) {
        dstNode.setStyle(srcNode.getStyle());
        dstNode.markDirtyAndPropogate();
    }
}
export function YGNodeStyleGetFlexGrow(node) {
    return node.getStyle().flexGrow.isUndefined() ? kDefaultFlexGrow : node.getStyle().flexGrow.unwrap();
}
export function YGNodeStyleGetFlexShrink(node) {
    return node.getStyle().flexShrink.isUndefined()
        ? node.getConfig().useWebDefaults
            ? kWebDefaultFlexShrink
            : kDefaultFlexShrink
        : node.getStyle().flexShrink.getValue();
}
function updateStyle(node, value, needsUpdate, update) {
    if (needsUpdate(node.getStyle(), value)) {
        update(node.getStyle(), value);
        node.markDirtyAndPropogate();
    }
}
function updateStyleProp(node, prop, value) {
    updateStyle(node, value, (style, value) => style[prop] != value, (style, value) => (style[prop] = value));
}
function updateIndexedStyleProp(node, prop, idx, value) {
    updateStyle(node, value, (style, value) => style[prop][idx] != value, (style, value) => (style[prop][idx] = value));
}
export function YGNodeStyleSetDirection(node, direction) {
    updateStyleProp(node, 'direction', direction);
}
export function YGNodeStyleGetDirection(node) {
    return node.getStyle().direction;
}
export function YGNodeStyleSetFlexDirection(node, flexDirection) {
    updateStyleProp(node, 'flexDirection', flexDirection);
}
export function YGNodeStyleGetFlexDirection(node) {
    return node.getStyle().flexDirection;
}
export function YGNodeStyleSetJustifyContent(node, justifyContent) {
    updateStyleProp(node, 'justifyContent', justifyContent);
}
export function YGNodeStyleGetJustifyContent(node) {
    return node.getStyle().justifyContent;
}
export function YGNodeStyleSetAlignContent(node, alignContent) {
    updateStyleProp(node, 'alignContent', alignContent);
}
export function YGNodeStyleGetAlignContent(node) {
    return node.getStyle().alignContent;
}
export function YGNodeStyleSetAlignItems(node, alignItems) {
    updateStyleProp(node, 'alignItems', alignItems);
}
export function YGNodeStyleGetAlignItems(node) {
    return node.getStyle().alignItems;
}
export function YGNodeStyleSetAlignSelf(node, alignSelf) {
    updateStyleProp(node, 'alignSelf', alignSelf);
}
export function YGNodeStyleGetAlignSelf(node) {
    return node.getStyle().alignSelf;
}
export function YGNodeStyleSetPositionType(node, positionType) {
    updateStyleProp(node, 'positionType', positionType);
}
export function YGNodeStyleGetPositionType(node) {
    return node.getStyle().positionType;
}
export function YGNodeStyleSetFlexWrap(node, flexWrap) {
    updateStyleProp(node, 'flexWrap', flexWrap);
}
export function YGNodeStyleGetFlexWrap(node) {
    return node.getStyle().flexWrap;
}
export function YGNodeStyleSetOverflow(node, overflow) {
    updateStyleProp(node, 'overflow', overflow);
}
export function YGNodeStyleGetOverflow(node) {
    return node.getStyle().overflow;
}
export function YGNodeStyleSetDisplay(node, display) {
    updateStyleProp(node, 'display', display);
}
export function YGNodeStyleGetDisplay(node) {
    return node.getStyle().display;
}
export function YGNodeStyleSetPosition(node, edge, position) {
    const value = new YGValue(YGFloatSanitize(position), YGFloatIsUndefined(position) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'position', edge, value);
}
export function YGNodeStyleSetPositionPercent(node, edge, position) {
    const value = new YGValue(YGFloatSanitize(position), YGFloatIsUndefined(position) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'position', edge, value);
}
export function YGNodeStyleGetPosition(node, edge) {
    return node.getStyle().position[edge];
}
export function YGNodeStyleSetMargin(node, edge, margin) {
    const value = new YGValue(YGFloatSanitize(margin), YGFloatIsUndefined(margin) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'margin', edge, value);
}
export function YGNodeStyleSetMarginPercent(node, edge, margin) {
    const value = new YGValue(YGFloatSanitize(margin), YGFloatIsUndefined(margin) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'margin', edge, value);
}
export function YGNodeStyleGetMargin(node, edge) {
    return node.getStyle().margin[edge];
}
export function YGNodeStyleSetPadding(node, edge, padding) {
    const value = new YGValue(YGFloatSanitize(padding), YGFloatIsUndefined(padding) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'padding', edge, value);
}
export function YGNodeStyleSetPaddingPercent(node, edge, padding) {
    const value = new YGValue(YGFloatSanitize(padding), YGFloatIsUndefined(padding) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'padding', edge, value);
}
export function YGNodeStyleGetPadding(node, edge) {
    return node.getStyle().padding[edge];
}
export function YGNodeStyleSetMarginAuto(node, edge) {
    updateIndexedStyleProp(node, 'margin', edge, YGValueAuto());
}
export function YGNodeStyleSetWidth(node, width) {
    const value = new YGValue(YGFloatSanitize(width), YGFloatIsUndefined(width) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'dimensions', YGDimension.Width, value);
}
export function YGNodeStyleSetWidthPercent(node, width) {
    const value = new YGValue(YGFloatSanitize(width), YGFloatIsUndefined(width) ? YGUnit.Auto : YGUnit.Percent);
    updateIndexedStyleProp(node, 'dimensions', YGDimension.Width, value);
}
export function YGNodeStyleSetWidthAuto(node) {
    updateIndexedStyleProp(node, 'dimensions', YGDimension.Width, YGValueAuto());
}
export function YGNodeStyleGetWidth(node) {
    return node.getStyle().dimensions[YGDimension.Width];
}
export function YGNodeStyleSetHeight(node, height) {
    const value = new YGValue(YGFloatSanitize(height), YGFloatIsUndefined(height) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'dimensions', YGDimension.Height, value);
}
export function YGNodeStyleSetHeightPercent(node, height) {
    const value = new YGValue(YGFloatSanitize(height), YGFloatIsUndefined(height) ? YGUnit.Auto : YGUnit.Percent);
    updateIndexedStyleProp(node, 'dimensions', YGDimension.Height, value);
}
export function YGNodeStyleSetHeightAuto(node) {
    updateIndexedStyleProp(node, 'dimensions', YGDimension.Height, YGValueAuto());
}
export function YGNodeStyleGetHeight(node) {
    return node.getStyle().dimensions[YGDimension.Height];
}
export function YGNodeStyleSetMinWidth(node, minWidth) {
    const value = new YGValue(YGFloatSanitize(minWidth), YGFloatIsUndefined(minWidth) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'minDimensions', YGDimension.Width, value);
}
export function YGNodeStyleSetMinWidthPercent(node, minWidth) {
    const value = new YGValue(YGFloatSanitize(minWidth), YGFloatIsUndefined(minWidth) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'minDimensions', YGDimension.Width, value);
}
export function YGNodeStyleGetMinWidth(node) {
    return node.getStyle().minDimensions[YGDimension.Width];
}
export function YGNodeStyleSetMinHeight(node, minHeight) {
    const value = new YGValue(YGFloatSanitize(minHeight), YGFloatIsUndefined(minHeight) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'minDimensions', YGDimension.Height, value);
}
export function YGNodeStyleSetMinHeightPercent(node, minHeight) {
    const value = new YGValue(YGFloatSanitize(minHeight), YGFloatIsUndefined(minHeight) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'minDimensions', YGDimension.Height, value);
}
export function YGNodeStyleGetMinHeight(node) {
    return node.getStyle().minDimensions[YGDimension.Height];
}
export function YGNodeStyleSetMaxWidth(node, maxWidth) {
    const value = new YGValue(YGFloatSanitize(maxWidth), YGFloatIsUndefined(maxWidth) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'maxDimensions', YGDimension.Width, value);
}
export function YGNodeStyleSetMaxWidthPercent(node, maxWidth) {
    const value = new YGValue(YGFloatSanitize(maxWidth), YGFloatIsUndefined(maxWidth) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'maxDimensions', YGDimension.Width, value);
}
export function YGNodeStyleGetMaxWidth(node) {
    return node.getStyle().maxDimensions[YGDimension.Width];
}
export function YGNodeStyleSetMaxHeight(node, maxHeight) {
    const value = new YGValue(YGFloatSanitize(maxHeight), YGFloatIsUndefined(maxHeight) ? YGUnit.Undefined : YGUnit.Point);
    updateIndexedStyleProp(node, 'maxDimensions', YGDimension.Height, value);
}
export function YGNodeStyleSetMaxHeightPercent(node, maxHeight) {
    const value = new YGValue(YGFloatSanitize(maxHeight), YGFloatIsUndefined(maxHeight) ? YGUnit.Undefined : YGUnit.Percent);
    updateIndexedStyleProp(node, 'maxDimensions', YGDimension.Height, value);
}
export function YGNodeStyleGetMaxHeight(node) {
    return node.getStyle().maxDimensions[YGDimension.Height];
}
export function YGNodeLayoutGetLeft(node) {
    return node.getLayout().position[YGEdge.Left];
}
export function YGNodeLayoutGetTop(node) {
    return node.getLayout().position[YGEdge.Top];
}
export function YGNodeLayoutGetRight(node) {
    return node.getLayout().position[YGEdge.Right];
}
export function YGNodeLayoutGetBottom(node) {
    return node.getLayout().position[YGEdge.Bottom];
}
export function YGNodeLayoutGetWidth(node) {
    return node.getLayout().dimensions[YGDimension.Width];
}
export function YGNodeLayoutGetHeight(node) {
    return node.getLayout().dimensions[YGDimension.Height];
}
export function YGNodeLayoutGetDirection(node) {
    return node.getLayout().direction;
}
export function YGNodeLayoutGetHadOverflow(node) {
    return node.getLayout().hadOverflow;
}
export function YGNodeLayoutGetMargin(node, edge_) {
    YGAssertWithNode(node, edge_ <= YGEdge.End, 'Cannot get layout properties of multi-edge shorthands');
    const edge = edge_;
    if (edge == YGEdge.Start) {
        if (node.getLayout().direction == YGDirection.RTL) {
            return node.getLayout().margin[YGEdge.Right];
        }
        else {
            return node.getLayout().margin[YGEdge.Left];
        }
    }
    if (edge == YGEdge.End) {
        if (node.getLayout().direction == YGDirection.RTL) {
            return node.getLayout().margin[YGEdge.Left];
        }
        else {
            return node.getLayout().margin[YGEdge.Right];
        }
    }
    return node.getLayout().margin[edge];
}
export function YGNodeLayoutGetBorder(node, edge_) {
    YGAssertWithNode(node, edge_ <= YGEdge.End, 'Cannot get layout properties of multi-edge shorthands');
    const edge = edge_;
    if (edge == YGEdge.Start) {
        if (node.getLayout().direction == YGDirection.RTL) {
            return node.getLayout().border[YGEdge.Right];
        }
        else {
            return node.getLayout().border[YGEdge.Left];
        }
    }
    if (edge == YGEdge.End) {
        if (node.getLayout().direction == YGDirection.RTL) {
            return node.getLayout().border[YGEdge.Left];
        }
        else {
            return node.getLayout().border[YGEdge.Right];
        }
    }
    return node.getLayout().border[edge];
}
export function YGNodeLayoutGetPadding(node, edge_) {
    YGAssertWithNode(node, edge_ <= YGEdge.End, 'Cannot get layout properties of multi-edge shorthands');
    const edge = edge_;
    if (edge == YGEdge.Start) {
        if (node.getLayout().direction == YGDirection.RTL) {
            return node.getLayout().padding[YGEdge.Right];
        }
        else {
            return node.getLayout().padding[YGEdge.Left];
        }
    }
    if (edge == YGEdge.End) {
        if (node.getLayout().direction == YGDirection.RTL) {
            return node.getLayout().padding[YGEdge.Left];
        }
        else {
            return node.getLayout().padding[YGEdge.Right];
        }
    }
    return node.getLayout().padding[edge];
}
// MACROS END
export function YGNodeStyleSetFlex(node, flex) {
    if (node.getStyle().flex.isDiffValue(flex)) {
        const style = node.getStyle();
        if (YGFloatIsUndefined(flex)) {
            style.flex = new YGFloatOptional();
        }
        else {
            style.flex = new YGFloatOptional(flex);
        }
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleGetFlex(node) {
    return node.getStyle().flex.isUndefined() ? YGUndefined : node.getStyle().flex.getValue();
}
export function YGNodeStyleSetFlexGrow(node, flexGrow) {
    if (node.getStyle().flexGrow.isDiffValue(flexGrow)) {
        const style = node.getStyle();
        if (YGFloatIsUndefined(flexGrow)) {
            style.flexGrow = new YGFloatOptional();
        }
        else {
            style.flexGrow = new YGFloatOptional(flexGrow);
        }
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleSetFlexShrink(node, flexShrink) {
    if (node.getStyle().flexShrink.isDiffValue(flexShrink)) {
        const style = node.getStyle();
        if (YGFloatIsUndefined(flexShrink)) {
            style.flexShrink = new YGFloatOptional();
        }
        else {
            style.flexShrink = new YGFloatOptional(flexShrink);
        }
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleGetFlexBasis(node) {
    const flexBasis = node.getStyle().flexBasis;
    if (flexBasis.unit == YGUnit.Undefined || flexBasis.unit == YGUnit.Auto) {
        flexBasis.value = YGUndefined;
    }
    return flexBasis;
}
export function YGNodeStyleSetFlexBasis(node, flexBasis) {
    const value = new YGValue(YGFloatSanitize(flexBasis), YGFloatIsUndefined(flexBasis) ? YGUnit.Undefined : YGUnit.Point);
    if ((node.getStyle().flexBasis.value != value.value && value.unit != YGUnit.Undefined) ||
        node.getStyle().flexBasis.unit != value.unit) {
        const style = node.getStyle();
        style.flexBasis = value;
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleSetFlexBasisPercent(node, flexBasisPercent) {
    if (node.getStyle().flexBasis.value != flexBasisPercent || node.getStyle().flexBasis.unit != YGUnit.Percent) {
        const style = node.getStyle();
        style.flexBasis.value = YGFloatSanitize(flexBasisPercent);
        style.flexBasis.unit = YGFloatIsUndefined(flexBasisPercent) ? YGUnit.Auto : YGUnit.Percent;
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleSetFlexBasisAuto(node) {
    if (node.getStyle().flexBasis.unit != YGUnit.Auto) {
        const style = node.getStyle();
        style.flexBasis.value = 0;
        style.flexBasis.unit = YGUnit.Auto;
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleSetBorder(node, edge, border) {
    const value = new YGValue(YGFloatSanitize(border), YGFloatIsUndefined(border) ? YGUnit.Undefined : YGUnit.Point);
    if ((node.getStyle().border[edge].value != value.value && value.unit != YGUnit.Undefined) ||
        node.getStyle().border[edge].unit != value.unit) {
        const style = node.getStyle();
        style.border[edge] = value;
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeStyleGetBorder(node, edge) {
    if (node.getStyle().border[edge].unit == YGUnit.Undefined || node.getStyle().border[edge].unit == YGUnit.Auto) {
        return YGUndefined;
    }
    return node.getStyle().border[edge].value;
}
export function YGNodeStyleGetAspectRatio(node) {
    const op = node.getStyle().aspectRatio;
    return op.isUndefined() ? YGUndefined : op.getValue();
}
export function YGNodeStyleSetAspectRatio(node, aspectRatio) {
    if (node.getStyle().aspectRatio.isDiffValue(aspectRatio)) {
        const style = node.getStyle();
        style.aspectRatio = new YGFloatOptional(aspectRatio);
        node.setStyle(style);
        node.markDirtyAndPropogate();
    }
}
export function YGNodeLayoutGetDidLegacyStretchFlagAffectLayout(node) {
    return node.getLayout().doesLegacyStretchFlagAffectsLayout;
}
let gCurrentGenerationCount = 0;
export function YGNodePrintInternal(node, options) {
    //const str: string = YGNodeToString(str, node, options, 0);
    //YGLog(node, YGLogLevel.Debug, str);
}
export function YGNodePrint(node, options) {
    YGNodePrintInternal(node, options);
}
export function YGNodePaddingAndBorderForAxis(node, axis, widthSize) {
    return node
        .getLeadingPaddingAndBorder(axis, widthSize)
        .add(node.getTrailingPaddingAndBorder(axis, widthSize))
        .unwrap();
}
export function YGNodeAlignItem(node, child) {
    const align = child.getStyle().alignSelf == YGAlign.Auto ? node.getStyle().alignItems : child.getStyle().alignSelf;
    if (align == YGAlign.Baseline && YGFlexDirectionIsColumn(node.getStyle().flexDirection)) {
        return YGAlign.FlexStart;
    }
    return align;
}
export function YGBaseline(node, layoutContext) {
    if (node.hasBaselineFunc()) {
        YGEvent.publish(node, EventType.NodeBaselineStart);
        const baseline = node.baseline(node.getLayout().measuredDimensions[YGDimension.Width], node.getLayout().measuredDimensions[YGDimension.Height], layoutContext);
        YGEvent.publish(node, EventType.NodeBaselineEnd);
        YGAssertWithNode(node, !YGFloatIsUndefined(baseline), 'Expect custom baseline function to not return NaN');
        return baseline;
    }
    let baselineChild = null;
    const childCount = YGNodeGetChildCount(node);
    for (let i = 0; i < childCount; i++) {
        const child = YGNodeGetChild(node, i);
        if (child.getLineIndex() > 0) {
            break;
        }
        if (child.getStyle().positionType == YGPositionType.Absolute) {
            continue;
        }
        if (YGNodeAlignItem(node, child) == YGAlign.Baseline || child.isReferenceBaseline()) {
            baselineChild = child;
            break;
        }
        if (baselineChild == null) {
            baselineChild = child;
        }
    }
    if (baselineChild == null) {
        return node.getLayout().measuredDimensions[YGDimension.Height];
    }
    const baseline = YGBaseline(baselineChild, layoutContext);
    return baseline + baselineChild.getLayout().position[YGEdge.Top];
}
export function YGIsBaselineLayout(node) {
    if (YGFlexDirectionIsColumn(node.getStyle().flexDirection)) {
        return false;
    }
    if (node.getStyle().alignItems == YGAlign.Baseline) {
        return true;
    }
    const childCount = YGNodeGetChildCount(node);
    for (let i = 0; i < childCount; i++) {
        const child = YGNodeGetChild(node, i);
        if (child.getStyle().positionType != YGPositionType.Absolute &&
            child.getStyle().alignSelf == YGAlign.Baseline) {
            return true;
        }
    }
    return false;
}
export function YGNodeDimWithMargin(node, axis, widthSize) {
    return (node.getLayout().measuredDimensions[dim[axis]] +
        node.getLeadingMargin(axis, widthSize).add(node.getTrailingMargin(axis, widthSize)).unwrap());
}
export function YGNodeIsStyleDimDefined(node, axis, ownerSize) {
    const isUndefined = YGFloatIsUndefined(node.getResolvedDimension(dim[axis]).value);
    return !(node.getResolvedDimension(dim[axis]).unit == YGUnit.Auto ||
        node.getResolvedDimension(dim[axis]).unit == YGUnit.Undefined ||
        (node.getResolvedDimension(dim[axis]).unit == YGUnit.Point &&
            !isUndefined &&
            node.getResolvedDimension(dim[axis]).value < 0.0) ||
        (node.getResolvedDimension(dim[axis]).unit == YGUnit.Percent &&
            !isUndefined &&
            (node.getResolvedDimension(dim[axis]).value < 0.0 || YGFloatIsUndefined(ownerSize))));
}
export function YGNodeIsLayoutDimDefined(node, axis) {
    const value = node.getLayout().measuredDimensions[dim[axis]];
    return !YGFloatIsUndefined(value) && value >= 0.0;
}
export function YGNodeBoundAxisWithinMinAndMax(node, axis, value, axisSize) {
    let min;
    let max;
    if (YGFlexDirectionIsColumn(axis)) {
        min = YGResolveValue(node.getStyle().minDimensions[YGDimension.Height], axisSize);
        max = YGResolveValue(node.getStyle().maxDimensions[YGDimension.Height], axisSize);
    }
    else if (YGFlexDirectionIsRow(axis)) {
        min = YGResolveValue(node.getStyle().minDimensions[YGDimension.Width], axisSize);
        max = YGResolveValue(node.getStyle().maxDimensions[YGDimension.Width], axisSize);
    }
    if (max.isBiggerEqual(new YGFloatOptional(0)) && value.isBigger(max)) {
        return max;
    }
    if (min.isBiggerEqual(new YGFloatOptional(0)) && value.isSmaller(min)) {
        return min;
    }
    return value;
}
export function YGNodeBoundAxis(node, axis, value, axisSize, widthSize) {
    return YGFloatMax(YGNodeBoundAxisWithinMinAndMax(node, axis, new YGFloatOptional(value), axisSize).unwrap(), YGNodePaddingAndBorderForAxis(node, axis, widthSize));
}
export function YGNodeSetChildTrailingPosition(node, child, axis) {
    const size = child.getLayout().measuredDimensions[dim[axis]];
    child.setLayoutPosition(node.getLayout().measuredDimensions[dim[axis]] - size - child.getLayout().position[pos[axis]], trailing[axis]);
}
export function YGConstrainMaxSizeForMode(node, axis, ownerAxisSize, ownerWidth, mode, size) {
    const maxSize = YGResolveValue(node.getStyle().maxDimensions[dim[axis]], ownerAxisSize).add(node.getMarginForAxis(axis, ownerWidth));
    switch (mode.value) {
        case YGMeasureMode.Exactly:
        case YGMeasureMode.AtMost:
            size.value = maxSize.isUndefined() || size.value < maxSize.getValue() ? size.value : maxSize.getValue();
            break;
        case YGMeasureMode.Undefined:
            if (!maxSize.isUndefined()) {
                mode.value = YGMeasureMode.AtMost;
                size.value = maxSize.getValue();
            }
            break;
    }
}
export function YGNodeComputeFlexBasisForChild(node, child, width, widthMode, height, ownerWidth, ownerHeight, heightMode, direction, config, layoutMarkerData, layoutContext, depth, generationCount) {
    const mainAxis = YGResolveFlexDirection(node.getStyle().flexDirection, direction);
    const isMainAxisRow = YGFlexDirectionIsRow(mainAxis);
    const mainAxisSize = isMainAxisRow ? width : height;
    const mainAxisownerSize = isMainAxisRow ? ownerWidth : ownerHeight;
    let childWidth;
    let childHeight;
    let childWidthMeasureMode;
    let childHeightMeasureMode;
    const resolvedFlexBasis = YGResolveValue(child.resolveFlexBasisPtr(), mainAxisownerSize);
    const isRowStyleDimDefined = YGNodeIsStyleDimDefined(child, YGFlexDirection.Row, ownerWidth);
    const isColumnStyleDimDefined = YGNodeIsStyleDimDefined(child, YGFlexDirection.Column, ownerHeight);
    if (!resolvedFlexBasis.isUndefined() && !YGFloatIsUndefined(mainAxisSize)) {
        if (child.getLayout().computedFlexBasis.isUndefined() ||
            (YGConfigIsExperimentalFeatureEnabled(child.getConfig(), YGExperimentalFeature.WebFlexBasis) &&
                child.getLayout().computedFlexBasisGeneration != generationCount)) {
            const paddingAndBorder = new YGFloatOptional(YGNodePaddingAndBorderForAxis(child, mainAxis, ownerWidth));
            child.setLayoutComputedFlexBasis(YGFloatOptionalMax(resolvedFlexBasis, paddingAndBorder));
        }
    }
    else if (isMainAxisRow && isRowStyleDimDefined) {
        // The width is definite, so use that as the flex basis.
        const paddingAndBorder = new YGFloatOptional(YGNodePaddingAndBorderForAxis(child, YGFlexDirection.Row, ownerWidth));
        child.setLayoutComputedFlexBasis(YGFloatOptionalMax(YGResolveValue(child.getResolvedDimensions()[YGDimension.Width], ownerWidth), paddingAndBorder));
    }
    else if (!isMainAxisRow && isColumnStyleDimDefined) {
        // The height is definite, so use that as the flex basis.
        const paddingAndBorder = new YGFloatOptional(YGNodePaddingAndBorderForAxis(child, YGFlexDirection.Column, ownerWidth));
        child.setLayoutComputedFlexBasis(YGFloatOptionalMax(YGResolveValue(child.getResolvedDimensions()[YGDimension.Height], ownerHeight), paddingAndBorder));
    }
    else {
        // Compute the flex basis and hypothetical main size (i.e. the clamped flex
        // basis).
        childWidth = YGUndefined;
        childHeight = YGUndefined;
        childWidthMeasureMode = YGMeasureMode.Undefined;
        childHeightMeasureMode = YGMeasureMode.Undefined;
        const marginRow = child.getMarginForAxis(YGFlexDirection.Row, ownerWidth).unwrap();
        const marginColumn = child.getMarginForAxis(YGFlexDirection.Column, ownerWidth).unwrap();
        if (isRowStyleDimDefined) {
            childWidth =
                YGResolveValue(child.getResolvedDimensions()[YGDimension.Width], ownerWidth).unwrap() + marginRow;
            childWidthMeasureMode = YGMeasureMode.Exactly;
        }
        if (isColumnStyleDimDefined) {
            childHeight =
                YGResolveValue(child.getResolvedDimensions()[YGDimension.Height], ownerHeight).unwrap() + marginColumn;
            childHeightMeasureMode = YGMeasureMode.Exactly;
        }
        // The W3C spec doesn't say anything about the 'overflow' property, but all
        // major browsers appear to implement the following logic.
        if ((!isMainAxisRow && node.getStyle().overflow == YGOverflow.Scroll) ||
            node.getStyle().overflow != YGOverflow.Scroll) {
            if (YGFloatIsUndefined(childWidth) && !YGFloatIsUndefined(width)) {
                childWidth = width;
                childWidthMeasureMode = YGMeasureMode.AtMost;
            }
        }
        if ((isMainAxisRow && node.getStyle().overflow == YGOverflow.Scroll) ||
            node.getStyle().overflow != YGOverflow.Scroll) {
            if (YGFloatIsUndefined(childHeight) && !YGFloatIsUndefined(height)) {
                childHeight = height;
                childHeightMeasureMode = YGMeasureMode.AtMost;
            }
        }
        const childStyle = child.getStyle();
        if (!childStyle.aspectRatio.isUndefined()) {
            if (!isMainAxisRow && childWidthMeasureMode == YGMeasureMode.Exactly) {
                childHeight = marginColumn + (childWidth - marginRow) / childStyle.aspectRatio.unwrap();
                childHeightMeasureMode = YGMeasureMode.Exactly;
            }
            else if (isMainAxisRow && childHeightMeasureMode == YGMeasureMode.Exactly) {
                childWidth = marginRow + (childHeight - marginColumn) * childStyle.aspectRatio.unwrap();
                childWidthMeasureMode = YGMeasureMode.Exactly;
            }
        }
        // If child has no defined size in the cross axis and is set to stretch, set
        // the cross axis to be measured exactly with the available inner width
        const hasExactWidth = !YGFloatIsUndefined(width) && widthMode == YGMeasureMode.Exactly;
        const childWidthStretch = YGNodeAlignItem(node, child) == YGAlign.Stretch && childWidthMeasureMode != YGMeasureMode.Exactly;
        if (!isMainAxisRow && !isRowStyleDimDefined && hasExactWidth && childWidthStretch) {
            childWidth = width;
            childWidthMeasureMode = YGMeasureMode.Exactly;
            if (!childStyle.aspectRatio.isUndefined()) {
                childHeight = (childWidth - marginRow) / childStyle.aspectRatio.unwrap();
                childHeightMeasureMode = YGMeasureMode.Exactly;
            }
        }
        const hasExactHeight = !YGFloatIsUndefined(height) && heightMode == YGMeasureMode.Exactly;
        const childHeightStretch = YGNodeAlignItem(node, child) == YGAlign.Stretch && childHeightMeasureMode != YGMeasureMode.Exactly;
        if (isMainAxisRow && !isColumnStyleDimDefined && hasExactHeight && childHeightStretch) {
            childHeight = height;
            childHeightMeasureMode = YGMeasureMode.Exactly;
            if (!childStyle.aspectRatio.isUndefined()) {
                childWidth = (childHeight - marginColumn) * childStyle.aspectRatio.unwrap();
                childWidthMeasureMode = YGMeasureMode.Exactly;
            }
        }
        const childWidthMeasureModeRef = { value: childWidthMeasureMode };
        const childWidthRef = { value: childWidth };
        const childHeightMeasureModeRef = { value: childHeightMeasureMode };
        const childHeightRef = { value: childHeight };
        YGConstrainMaxSizeForMode(child, YGFlexDirection.Row, ownerWidth, ownerWidth, childWidthMeasureModeRef, childWidthRef);
        YGConstrainMaxSizeForMode(child, YGFlexDirection.Column, ownerHeight, ownerWidth, childHeightMeasureModeRef, childHeightRef);
        // Measure the child
        YGLayoutNodeInternal(child, childWidth, childHeight, direction, childWidthMeasureMode, childHeightMeasureMode, ownerWidth, ownerHeight, false, LayoutPassReason.kMeasureChild, config, layoutMarkerData, layoutContext, depth, generationCount);
        child.setLayoutComputedFlexBasis(new YGFloatOptional(YGFloatMax(child.getLayout().measuredDimensions[dim[mainAxis]], YGNodePaddingAndBorderForAxis(child, mainAxis, ownerWidth))));
    }
    child.setLayoutComputedFlexBasisGeneration(generationCount);
}
export function YGNodeAbsoluteLayoutChild(node, child, width, widthMode, height, direction, config, layoutMarkerData, layoutContext, depth, generationCount) {
    const mainAxis = YGResolveFlexDirection(node.getStyle().flexDirection, direction);
    const crossAxis = YGFlexDirectionCross(mainAxis, direction);
    const isMainAxisRow = YGFlexDirectionIsRow(mainAxis);
    let childWidth = YGUndefined;
    let childHeight = YGUndefined;
    let childWidthMeasureMode = YGMeasureMode.Undefined;
    let childHeightMeasureMode = YGMeasureMode.Undefined;
    const marginRow = child.getMarginForAxis(YGFlexDirection.Row, width).unwrap();
    const marginColumn = child.getMarginForAxis(YGFlexDirection.Column, width).unwrap();
    if (YGNodeIsStyleDimDefined(child, YGFlexDirection.Row, width)) {
        childWidth = YGResolveValue(child.getResolvedDimensions()[YGDimension.Width], width).unwrap() + marginRow;
    }
    else {
        // If the child doesn't have a specified width, compute the width based on
        // the left/right offsets if they're defined.
        if (child.isLeadingPositionDefined(YGFlexDirection.Row) && child.isTrailingPosDefined(YGFlexDirection.Row)) {
            childWidth =
                node.getLayout().measuredDimensions[YGDimension.Width] -
                    (node.getLeadingBorder(YGFlexDirection.Row) + node.getTrailingBorder(YGFlexDirection.Row)) -
                    child
                        .getLeadingPosition(YGFlexDirection.Row, width)
                        .add(child.getTrailingPosition(YGFlexDirection.Row, width))
                        .unwrap();
            childWidth = YGNodeBoundAxis(child, YGFlexDirection.Row, childWidth, width, width);
        }
    }
    if (YGNodeIsStyleDimDefined(child, YGFlexDirection.Column, height)) {
        childHeight = YGResolveValue(child.getResolvedDimensions()[YGDimension.Height], height).unwrap() + marginColumn;
    }
    else {
        // If the child doesn't have a specified height, compute the height based on
        // the top/bottom offsets if they're defined.
        if (child.isLeadingPositionDefined(YGFlexDirection.Column) &&
            child.isTrailingPosDefined(YGFlexDirection.Column)) {
            childHeight =
                node.getLayout().measuredDimensions[YGDimension.Height] -
                    (node.getLeadingBorder(YGFlexDirection.Column) + node.getTrailingBorder(YGFlexDirection.Column)) -
                    child
                        .getLeadingPosition(YGFlexDirection.Column, height)
                        .add(child.getTrailingPosition(YGFlexDirection.Column, height))
                        .unwrap();
            childHeight = YGNodeBoundAxis(child, YGFlexDirection.Column, childHeight, height, width);
        }
    }
    // Exactly one dimension needs to be defined for us to be able to do aspect
    // ratio calculation. One dimension being the anchor and the other being
    // flexible.
    const childStyle = child.getStyle();
    if (YGFloatIsUndefined(childWidth) != YGFloatIsUndefined(childHeight)) {
        if (!childStyle.aspectRatio.isUndefined()) {
            if (YGFloatIsUndefined(childWidth)) {
                childWidth = marginRow + (childHeight - marginColumn) * childStyle.aspectRatio.unwrap();
            }
            else if (YGFloatIsUndefined(childHeight)) {
                childHeight = marginColumn + (childWidth - marginRow) / childStyle.aspectRatio.unwrap();
            }
        }
    }
    // If we're still missing one or the other dimension, measure the content.
    if (YGFloatIsUndefined(childWidth) || YGFloatIsUndefined(childHeight)) {
        childWidthMeasureMode = YGFloatIsUndefined(childWidth) ? YGMeasureMode.Undefined : YGMeasureMode.Exactly;
        childHeightMeasureMode = YGFloatIsUndefined(childHeight) ? YGMeasureMode.Undefined : YGMeasureMode.Exactly;
        // If the size of the owner is defined then try to constrain the absolute
        // child to that size as well. This allows text within the absolute child to
        // wrap to the size of its owner. This is the same behavior as many browsers
        // implement.
        if (!isMainAxisRow &&
            YGFloatIsUndefined(childWidth) &&
            widthMode != YGMeasureMode.Undefined &&
            !YGFloatIsUndefined(width) &&
            width > 0) {
            childWidth = width;
            childWidthMeasureMode = YGMeasureMode.AtMost;
        }
        YGLayoutNodeInternal(child, childWidth, childHeight, direction, childWidthMeasureMode, childHeightMeasureMode, childWidth, childHeight, false, LayoutPassReason.kAbsMeasureChild, config, layoutMarkerData, layoutContext, depth, generationCount);
        childWidth =
            child.getLayout().measuredDimensions[YGDimension.Width] +
                child.getMarginForAxis(YGFlexDirection.Row, width).unwrap();
        childHeight =
            child.getLayout().measuredDimensions[YGDimension.Height] +
                child.getMarginForAxis(YGFlexDirection.Column, width).unwrap();
    }
    YGLayoutNodeInternal(child, childWidth, childHeight, direction, YGMeasureMode.Exactly, YGMeasureMode.Exactly, childWidth, childHeight, true, LayoutPassReason.kAbsLayout, config, layoutMarkerData, layoutContext, depth, generationCount);
    if (child.isTrailingPosDefined(mainAxis) && !child.isLeadingPositionDefined(mainAxis)) {
        child.setLayoutPosition(node.getLayout().measuredDimensions[dim[mainAxis]] -
            child.getLayout().measuredDimensions[dim[mainAxis]] -
            node.getTrailingBorder(mainAxis) -
            child.getTrailingMargin(mainAxis, width).unwrap() -
            child.getTrailingPosition(mainAxis, isMainAxisRow ? width : height).unwrap(), leading[mainAxis]);
    }
    else if (!child.isLeadingPositionDefined(mainAxis) && node.getStyle().justifyContent == YGJustify.Center) {
        child.setLayoutPosition((node.getLayout().measuredDimensions[dim[mainAxis]] - child.getLayout().measuredDimensions[dim[mainAxis]]) /
            2.0, leading[mainAxis]);
    }
    else if (!child.isLeadingPositionDefined(mainAxis) && node.getStyle().justifyContent == YGJustify.FlexEnd) {
        child.setLayoutPosition(node.getLayout().measuredDimensions[dim[mainAxis]] - child.getLayout().measuredDimensions[dim[mainAxis]], leading[mainAxis]);
    }
    if (child.isTrailingPosDefined(crossAxis) && !child.isLeadingPositionDefined(crossAxis)) {
        child.setLayoutPosition(node.getLayout().measuredDimensions[dim[crossAxis]] -
            child.getLayout().measuredDimensions[dim[crossAxis]] -
            node.getTrailingBorder(crossAxis) -
            child.getTrailingMargin(crossAxis, width).unwrap() -
            child.getTrailingPosition(crossAxis, isMainAxisRow ? height : width).unwrap(), leading[crossAxis]);
    }
    else if (!child.isLeadingPositionDefined(crossAxis) && YGNodeAlignItem(node, child) == YGAlign.Center) {
        child.setLayoutPosition((node.getLayout().measuredDimensions[dim[crossAxis]] -
            child.getLayout().measuredDimensions[dim[crossAxis]]) /
            2.0, leading[crossAxis]);
    }
    else if (!child.isLeadingPositionDefined(crossAxis) &&
        (YGNodeAlignItem(node, child) == YGAlign.FlexEnd) != (node.getStyle().flexWrap == YGWrap.WrapReverse)) {
        child.setLayoutPosition(node.getLayout().measuredDimensions[dim[crossAxis]] - child.getLayout().measuredDimensions[dim[crossAxis]], leading[crossAxis]);
    }
}
export function YGNodeWithMeasureFuncSetMeasuredDimensions(node, availableWidth, availableHeight, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, layoutMarkerData, layoutContext, reason) {
    YGAssertWithNode(node, node.hasMeasureFunc(), 'Expected node to have custom measure function');
    if (widthMeasureMode == YGMeasureMode.Undefined) {
        availableWidth = YGUndefined;
    }
    if (heightMeasureMode == YGMeasureMode.Undefined) {
        availableHeight = YGUndefined;
    }
    const padding = node.getLayout().padding;
    const border = node.getLayout().border;
    const paddingAndBorderAxisRow = padding[YGEdge.Left] + padding[YGEdge.Right] + border[YGEdge.Left] + border[YGEdge.Right];
    const paddingAndBorderAxisColumn = padding[YGEdge.Top] + padding[YGEdge.Bottom] + border[YGEdge.Top] + border[YGEdge.Bottom];
    const innerWidth = YGFloatIsUndefined(availableWidth)
        ? availableWidth
        : YGFloatMax(0, availableWidth - paddingAndBorderAxisRow);
    const innerHeight = YGFloatIsUndefined(availableHeight)
        ? availableHeight
        : YGFloatMax(0, availableHeight - paddingAndBorderAxisColumn);
    if (widthMeasureMode == YGMeasureMode.Exactly && heightMeasureMode == YGMeasureMode.Exactly) {
        // Don't bother sizing the text if both dimensions are already defined.
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Row, availableWidth, ownerWidth, ownerWidth), YGDimension.Width);
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Column, availableHeight, ownerHeight, ownerWidth), YGDimension.Height);
    }
    else {
        YGEvent.publish(node, EventType.MeasureCallbackStart);
        const measuredSize = node.measure(innerWidth, widthMeasureMode, innerHeight, heightMeasureMode, layoutContext);
        layoutMarkerData.measureCallbacks += 1;
        layoutMarkerData.measureCallbackReasonsCount[reason] += 1;
        YGEvent.publish(node, EventType.MeasureCallbackEnd, {
            layoutContext,
            width: innerWidth,
            widthMeasureMode,
            height: innerHeight,
            heightMeasureMode,
            measuredWidth: measuredSize.width,
            measuredHeight: measuredSize.height,
            reason,
        });
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Row, widthMeasureMode == YGMeasureMode.Undefined || widthMeasureMode == YGMeasureMode.AtMost
            ? measuredSize.width + paddingAndBorderAxisRow
            : availableWidth, ownerWidth, ownerWidth), YGDimension.Width);
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Column, heightMeasureMode == YGMeasureMode.Undefined || heightMeasureMode == YGMeasureMode.AtMost
            ? measuredSize.height + paddingAndBorderAxisColumn
            : availableHeight, ownerHeight, ownerWidth), YGDimension.Height);
    }
}
export function YGNodeEmptyContainerSetMeasuredDimensions(node, availableWidth, availableHeight, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight) {
    const padding = node.getLayout().padding;
    const border = node.getLayout().border;
    let width = availableWidth;
    if (widthMeasureMode == YGMeasureMode.Undefined || widthMeasureMode == YGMeasureMode.AtMost) {
        width = padding[YGEdge.Left] + padding[YGEdge.Right] + border[YGEdge.Left] + border[YGEdge.Right];
    }
    node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Row, width, ownerWidth, ownerWidth), YGDimension.Width);
    let height = availableHeight;
    if (heightMeasureMode == YGMeasureMode.Undefined || heightMeasureMode == YGMeasureMode.AtMost) {
        height = padding[YGEdge.Top] + padding[YGEdge.Bottom] + border[YGEdge.Top] + border[YGEdge.Bottom];
    }
    node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Column, height, ownerHeight, ownerWidth), YGDimension.Height);
}
export function YGNodeFixedSizeSetMeasuredDimensions(node, availableWidth, availableHeight, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight) {
    if ((!YGFloatIsUndefined(availableWidth) && widthMeasureMode == YGMeasureMode.AtMost && availableWidth <= 0.0) ||
        (!YGFloatIsUndefined(availableHeight) && heightMeasureMode == YGMeasureMode.AtMost && availableHeight <= 0.0) ||
        (widthMeasureMode == YGMeasureMode.Exactly && heightMeasureMode == YGMeasureMode.Exactly)) {
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Row, YGFloatIsUndefined(availableWidth) || (widthMeasureMode == YGMeasureMode.AtMost && availableWidth < 0.0)
            ? 0.0
            : availableWidth, ownerWidth, ownerWidth), YGDimension.Width);
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Column, YGFloatIsUndefined(availableHeight) ||
            (heightMeasureMode == YGMeasureMode.AtMost && availableHeight < 0.0)
            ? 0.0
            : availableHeight, ownerHeight, ownerWidth), YGDimension.Height);
        return true;
    }
    return false;
}
export function YGZeroOutLayoutRecursivly(node, layoutContext) {
    // deviation: use clean() to empty layout instead of assigning to a struct
    // with default values.
    //
    // original: node.getLayout() = {};
    node.getLayout().clean();
    node.setLayoutDimension(0, 0);
    node.setLayoutDimension(0, 1);
    node.setHasNewLayout(true);
    node.iterChildrenAfterCloningIfNeeded(YGZeroOutLayoutRecursivly, layoutContext);
}
export function YGNodeCalculateAvailableInnerDim(node, dimension, availableDim, paddingAndBorder, ownerDim) {
    let availableInnerDim = availableDim - paddingAndBorder;
    // Max dimension overrides predefined dimension value; Min dimension in turn
    // overrides both of the above
    if (!YGFloatIsUndefined(availableInnerDim)) {
        // We want to make sure our available height does not violate min and
        // max constraints
        const minDimensionOptional = YGResolveValue(node.getStyle().minDimensions[dimension], ownerDim);
        const minInnerDim = minDimensionOptional.isUndefined()
            ? 0.0
            : minDimensionOptional.unwrap() - paddingAndBorder;
        const maxDimensionOptional = YGResolveValue(node.getStyle().maxDimensions[dimension], ownerDim);
        const maxInnerDim = maxDimensionOptional.isUndefined()
            ? Number.MAX_VALUE
            : maxDimensionOptional.unwrap() - paddingAndBorder;
        availableInnerDim = YGFloatMax(YGFloatMin(availableInnerDim, maxInnerDim), minInnerDim);
    }
    return availableInnerDim;
}
export function YGNodeComputeFlexBasisForChildren(node, availableInnerWidth, availableInnerHeight, widthMeasureMode, heightMeasureMode, direction, mainAxis, config, performLayout, layoutMarkerData, layoutContext, depth, generationCount) {
    let totalOuterFlexBasis = 0.0;
    let singleFlexChild = null;
    const children = node.getChildren();
    const measureModeMainDim = YGFlexDirectionIsRow(mainAxis) ? widthMeasureMode : heightMeasureMode;
    // If there is only one child with flexGrow + flexShrink it means we can set
    // the computedFlexBasis to 0 instead of measuring and shrinking / flexing the
    // child to exactly match the remaining space
    if (measureModeMainDim == YGMeasureMode.Exactly) {
        for (const child of children) {
            if (child.isNodeFlexible()) {
                if (singleFlexChild != null ||
                    YGFloatsEqual(child.resolveFlexGrow(), 0.0) ||
                    YGFloatsEqual(child.resolveFlexShrink(), 0.0)) {
                    // There is already a flexible child, or this flexible child doesn't
                    // have flexGrow and flexShrink, abort
                    singleFlexChild = null;
                    break;
                }
                else {
                    singleFlexChild = child;
                }
            }
        }
    }
    for (const child of children) {
        child.resolveDimension();
        if (child.getStyle().display == YGDisplay.None) {
            YGZeroOutLayoutRecursivly(child, layoutContext);
            child.setHasNewLayout(true);
            child.setDirty(false);
            continue;
        }
        if (performLayout) {
            // Set the initial position (relative to the owner).
            const childDirection = child.resolveDirection(direction);
            const mainDim = YGFlexDirectionIsRow(mainAxis) ? availableInnerWidth : availableInnerHeight;
            const crossDim = YGFlexDirectionIsRow(mainAxis) ? availableInnerHeight : availableInnerWidth;
            child.setPosition(childDirection, mainDim, crossDim, availableInnerWidth);
        }
        if (child.getStyle().positionType == YGPositionType.Absolute) {
            continue;
        }
        if (child == singleFlexChild) {
            child.setLayoutComputedFlexBasisGeneration(generationCount);
            child.setLayoutComputedFlexBasis(new YGFloatOptional(0));
        }
        else {
            YGNodeComputeFlexBasisForChild(node, child, availableInnerWidth, widthMeasureMode, availableInnerHeight, availableInnerWidth, availableInnerHeight, heightMeasureMode, direction, config, layoutMarkerData, layoutContext, depth, generationCount);
        }
        totalOuterFlexBasis +=
            child.getLayout().computedFlexBasis.unwrap() +
                child.getMarginForAxis(mainAxis, availableInnerWidth).unwrap();
    }
    return totalOuterFlexBasis;
}
export function YGCalculateCollectFlexItemsRowValues(node, ownerDirection, mainAxisownerSize, availableInnerWidth, availableInnerMainDim, startOfLineIndex, lineCount) {
    const flexAlgoRowMeasurement = new YGCollectFlexItemsRowValues();
    //flexAlgoRowMeasurement.relativeChildren = new Array(node.getChildren().length);
    let sizeConsumedOnCurrentLineIncludingMinConstraint = 0;
    const mainAxis = YGResolveFlexDirection(node.getStyle().flexDirection, node.resolveDirection(ownerDirection));
    const isNodeFlexWrap = node.getStyle().flexWrap != YGWrap.NoWrap;
    // Add items to the current line until it's full or we run out of items.
    let endOfLineIndex = startOfLineIndex;
    for (; endOfLineIndex < node.getChildren().length; endOfLineIndex++) {
        const child = node.getChild(endOfLineIndex);
        if (child.getStyle().display == YGDisplay.None || child.getStyle().positionType == YGPositionType.Absolute) {
            continue;
        }
        child.setLineIndex(lineCount);
        const childMarginMainAxis = child.getMarginForAxis(mainAxis, availableInnerWidth).unwrap();
        const flexBasisWithMinAndMaxConstraints = YGNodeBoundAxisWithinMinAndMax(child, mainAxis, child.getLayout().computedFlexBasis, mainAxisownerSize).unwrap();
        // If this is a multi-line flow and this item pushes us over the available
        // size, we've hit the end of the current line. Break out of the loop and
        // lay out the current line.
        if (sizeConsumedOnCurrentLineIncludingMinConstraint + flexBasisWithMinAndMaxConstraints + childMarginMainAxis >
            availableInnerMainDim &&
            isNodeFlexWrap &&
            flexAlgoRowMeasurement.itemsOnLine > 0) {
            break;
        }
        sizeConsumedOnCurrentLineIncludingMinConstraint += flexBasisWithMinAndMaxConstraints + childMarginMainAxis;
        flexAlgoRowMeasurement.sizeConsumedOnCurrentLine += flexBasisWithMinAndMaxConstraints + childMarginMainAxis;
        flexAlgoRowMeasurement.itemsOnLine++;
        if (child.isNodeFlexible()) {
            flexAlgoRowMeasurement.totalFlexGrowFactors += child.resolveFlexGrow();
            // Unlike the grow factor, the shrink factor is scaled relative to the
            // child dimension.
            flexAlgoRowMeasurement.totalFlexShrinkScaledFactors +=
                -child.resolveFlexShrink() * child.getLayout().computedFlexBasis.unwrap();
        }
        flexAlgoRowMeasurement.relativeChildren.push(child);
    }
    // The total flex factor needs to be floored to 1.
    if (flexAlgoRowMeasurement.totalFlexGrowFactors > 0 && flexAlgoRowMeasurement.totalFlexGrowFactors < 1) {
        flexAlgoRowMeasurement.totalFlexGrowFactors = 1;
    }
    // The total flex shrink factor needs to be floored to 1.
    if (flexAlgoRowMeasurement.totalFlexShrinkScaledFactors > 0 &&
        flexAlgoRowMeasurement.totalFlexShrinkScaledFactors < 1) {
        flexAlgoRowMeasurement.totalFlexShrinkScaledFactors = 1;
    }
    flexAlgoRowMeasurement.endOfLineIndex = endOfLineIndex;
    return flexAlgoRowMeasurement;
}
export function YGDistributeFreeSpaceSecondPass(collectedFlexItemsValues, node, mainAxis, crossAxis, mainAxisownerSize, availableInnerMainDim, availableInnerCrossDim, availableInnerWidth, availableInnerHeight, flexBasisOverflows, measureModeCrossDim, performLayout, config, layoutMarkerData, layoutContext, depth, generationCount) {
    let childFlexBasis = 0;
    let flexShrinkScaledFactor = 0;
    let flexGrowFactor = 0;
    let deltaFreeSpace = 0;
    const isMainAxisRow = YGFlexDirectionIsRow(mainAxis);
    const isNodeFlexWrap = node.getStyle().flexWrap != YGWrap.NoWrap;
    for (const currentRelativeChild of collectedFlexItemsValues.relativeChildren) {
        childFlexBasis = YGNodeBoundAxisWithinMinAndMax(currentRelativeChild, mainAxis, currentRelativeChild.getLayout().computedFlexBasis, mainAxisownerSize).unwrap();
        let updatedMainSize = childFlexBasis;
        if (!YGFloatIsUndefined(collectedFlexItemsValues.remainingFreeSpace) &&
            collectedFlexItemsValues.remainingFreeSpace < 0) {
            flexShrinkScaledFactor = -currentRelativeChild.resolveFlexShrink() * childFlexBasis;
            // Is this child able to shrink?
            if (flexShrinkScaledFactor != 0) {
                let childSize;
                if (!YGFloatIsUndefined(collectedFlexItemsValues.totalFlexShrinkScaledFactors) &&
                    collectedFlexItemsValues.totalFlexShrinkScaledFactors == 0) {
                    childSize = childFlexBasis + flexShrinkScaledFactor;
                }
                else {
                    childSize =
                        childFlexBasis +
                            (collectedFlexItemsValues.remainingFreeSpace /
                                collectedFlexItemsValues.totalFlexShrinkScaledFactors) *
                                flexShrinkScaledFactor;
                }
                updatedMainSize = YGNodeBoundAxis(currentRelativeChild, mainAxis, childSize, availableInnerMainDim, availableInnerWidth);
            }
        }
        else if (!YGFloatIsUndefined(collectedFlexItemsValues.remainingFreeSpace) &&
            collectedFlexItemsValues.remainingFreeSpace > 0) {
            flexGrowFactor = currentRelativeChild.resolveFlexGrow();
            // Is this child able to grow?
            if (!YGFloatIsUndefined(flexGrowFactor) && flexGrowFactor != 0) {
                updatedMainSize = YGNodeBoundAxis(currentRelativeChild, mainAxis, childFlexBasis +
                    (collectedFlexItemsValues.remainingFreeSpace / collectedFlexItemsValues.totalFlexGrowFactors) *
                        flexGrowFactor, availableInnerMainDim, availableInnerWidth);
            }
        }
        deltaFreeSpace += updatedMainSize - childFlexBasis;
        const marginMain = currentRelativeChild.getMarginForAxis(mainAxis, availableInnerWidth).unwrap();
        const marginCross = currentRelativeChild.getMarginForAxis(crossAxis, availableInnerWidth).unwrap();
        let childCrossSize;
        const childMainSize = updatedMainSize + marginMain;
        let childCrossMeasureMode;
        const childMainMeasureMode = YGMeasureMode.Exactly;
        const childStyle = currentRelativeChild.getStyle();
        if (!childStyle.aspectRatio.isUndefined()) {
            childCrossSize = isMainAxisRow
                ? (childMainSize - marginMain) / childStyle.aspectRatio.unwrap()
                : (childMainSize - marginMain) * childStyle.aspectRatio.unwrap();
            childCrossMeasureMode = YGMeasureMode.Exactly;
            childCrossSize += marginCross;
        }
        else if (!YGFloatIsUndefined(availableInnerCrossDim) &&
            !YGNodeIsStyleDimDefined(currentRelativeChild, crossAxis, availableInnerCrossDim) &&
            measureModeCrossDim == YGMeasureMode.Exactly &&
            !(isNodeFlexWrap && flexBasisOverflows) &&
            YGNodeAlignItem(node, currentRelativeChild) == YGAlign.Stretch &&
            currentRelativeChild.marginLeadingValue(crossAxis).unit != YGUnit.Auto &&
            currentRelativeChild.marginTrailingValue(crossAxis).unit != YGUnit.Auto) {
            childCrossSize = availableInnerCrossDim;
            childCrossMeasureMode = YGMeasureMode.Exactly;
        }
        else if (!YGNodeIsStyleDimDefined(currentRelativeChild, crossAxis, availableInnerCrossDim)) {
            childCrossSize = availableInnerCrossDim;
            childCrossMeasureMode = YGFloatIsUndefined(childCrossSize) ? YGMeasureMode.Undefined : YGMeasureMode.AtMost;
        }
        else {
            childCrossSize =
                YGResolveValue(currentRelativeChild.getResolvedDimension(dim[crossAxis]), availableInnerCrossDim).unwrap() + marginCross;
            const isLoosePercentageMeasurement = currentRelativeChild.getResolvedDimension(dim[crossAxis]).unit == YGUnit.Percent &&
                measureModeCrossDim != YGMeasureMode.Exactly;
            childCrossMeasureMode =
                YGFloatIsUndefined(childCrossSize) || isLoosePercentageMeasurement
                    ? YGMeasureMode.Undefined
                    : YGMeasureMode.Exactly;
        }
        const childMainMeasureModeRef = { value: childMainMeasureMode };
        const childMainSizeRef = { value: childMainSize };
        const childCrossMeasureModeRef = { value: childCrossMeasureMode };
        const childCrossSizeRef = { value: childCrossSize };
        YGConstrainMaxSizeForMode(currentRelativeChild, mainAxis, availableInnerMainDim, availableInnerWidth, childMainMeasureModeRef, childMainSizeRef);
        YGConstrainMaxSizeForMode(currentRelativeChild, crossAxis, availableInnerCrossDim, availableInnerWidth, childCrossMeasureModeRef, childCrossSizeRef);
        const requiresStretchLayout = !YGNodeIsStyleDimDefined(currentRelativeChild, crossAxis, availableInnerCrossDim) &&
            YGNodeAlignItem(node, currentRelativeChild) == YGAlign.Stretch &&
            currentRelativeChild.marginLeadingValue(crossAxis).unit != YGUnit.Auto &&
            currentRelativeChild.marginTrailingValue(crossAxis).unit != YGUnit.Auto;
        const childWidth = isMainAxisRow ? childMainSize : childCrossSize;
        const childHeight = !isMainAxisRow ? childMainSize : childCrossSize;
        const childWidthMeasureMode = isMainAxisRow ? childMainMeasureMode : childCrossMeasureMode;
        const childHeightMeasureMode = !isMainAxisRow ? childMainMeasureMode : childCrossMeasureMode;
        const isLayoutPass = performLayout && !requiresStretchLayout;
        // Recursively call the layout algorithm for this child with the updated
        // main size.
        YGLayoutNodeInternal(currentRelativeChild, childWidth, childHeight, node.getLayout().direction, childWidthMeasureMode, childHeightMeasureMode, availableInnerWidth, availableInnerHeight, isLayoutPass, isLayoutPass ? LayoutPassReason.kFlexLayout : LayoutPassReason.kFlexMeasure, config, layoutMarkerData, layoutContext, depth, generationCount);
        node.setLayoutHadOverflow(node.getLayout().hadOverflow || currentRelativeChild.getLayout().hadOverflow);
    }
    return deltaFreeSpace;
}
export function YGDistributeFreeSpaceFirstPass(collectedFlexItemsValues, mainAxis, mainAxisownerSize, availableInnerMainDim, availableInnerWidth) {
    let flexShrinkScaledFactor = 0;
    let flexGrowFactor = 0;
    let baseMainSize = 0;
    let boundMainSize = 0;
    let deltaFreeSpace = 0;
    for (const currentRelativeChild of collectedFlexItemsValues.relativeChildren) {
        const childFlexBasis = YGNodeBoundAxisWithinMinAndMax(currentRelativeChild, mainAxis, currentRelativeChild.getLayout().computedFlexBasis, mainAxisownerSize).unwrap();
        if (collectedFlexItemsValues.remainingFreeSpace < 0) {
            flexShrinkScaledFactor = -currentRelativeChild.resolveFlexShrink() * childFlexBasis;
            // Is this child able to shrink?
            if (!YGFloatIsUndefined(flexShrinkScaledFactor) && flexShrinkScaledFactor != 0) {
                baseMainSize =
                    childFlexBasis +
                        (collectedFlexItemsValues.remainingFreeSpace /
                            collectedFlexItemsValues.totalFlexShrinkScaledFactors) *
                            flexShrinkScaledFactor;
                boundMainSize = YGNodeBoundAxis(currentRelativeChild, mainAxis, baseMainSize, availableInnerMainDim, availableInnerWidth);
                if (!YGFloatIsUndefined(baseMainSize) &&
                    !YGFloatIsUndefined(boundMainSize) &&
                    baseMainSize != boundMainSize) {
                    // By excluding this item's size and flex factor from remaining, this
                    // item's min/max constraints should also trigger in the second pass
                    // resulting in the item's size calculation being identical in the
                    // first and second passes.
                    deltaFreeSpace += boundMainSize - childFlexBasis;
                    collectedFlexItemsValues.totalFlexShrinkScaledFactors -=
                        -currentRelativeChild.resolveFlexShrink() *
                            currentRelativeChild.getLayout().computedFlexBasis.unwrap();
                }
            }
        }
        else if (!YGFloatIsUndefined(collectedFlexItemsValues.remainingFreeSpace) &&
            collectedFlexItemsValues.remainingFreeSpace > 0) {
            flexGrowFactor = currentRelativeChild.resolveFlexGrow();
            // Is this child able to grow?
            if (!YGFloatIsUndefined(flexGrowFactor) && flexGrowFactor != 0) {
                baseMainSize =
                    childFlexBasis +
                        (collectedFlexItemsValues.remainingFreeSpace / collectedFlexItemsValues.totalFlexGrowFactors) *
                            flexGrowFactor;
                boundMainSize = YGNodeBoundAxis(currentRelativeChild, mainAxis, baseMainSize, availableInnerMainDim, availableInnerWidth);
                if (!YGFloatIsUndefined(baseMainSize) &&
                    !YGFloatIsUndefined(boundMainSize) &&
                    baseMainSize != boundMainSize) {
                    // By excluding this item's size and flex factor from remaining, this
                    // item's min/max constraints should also trigger in the second pass
                    // resulting in the item's size calculation being identical in the
                    // first and second passes.
                    deltaFreeSpace += boundMainSize - childFlexBasis;
                    collectedFlexItemsValues.totalFlexGrowFactors -= flexGrowFactor;
                }
            }
        }
    }
    collectedFlexItemsValues.remainingFreeSpace -= deltaFreeSpace;
}
export function YGResolveFlexibleLength(node, collectedFlexItemsValues, mainAxis, crossAxis, mainAxisownerSize, availableInnerMainDim, availableInnerCrossDim, availableInnerWidth, availableInnerHeight, flexBasisOverflows, measureModeCrossDim, performLayout, config, layoutMarkerData, layoutContext, depth, generationCount) {
    const originalFreeSpace = collectedFlexItemsValues.remainingFreeSpace;
    // First pass: detect the flex items whose min/max constraints trigger
    YGDistributeFreeSpaceFirstPass(collectedFlexItemsValues, mainAxis, mainAxisownerSize, availableInnerMainDim, availableInnerWidth);
    // Second pass: resolve the sizes of the flexible items
    const distributedFreeSpace = YGDistributeFreeSpaceSecondPass(collectedFlexItemsValues, node, mainAxis, crossAxis, mainAxisownerSize, availableInnerMainDim, availableInnerCrossDim, availableInnerWidth, availableInnerHeight, flexBasisOverflows, measureModeCrossDim, performLayout, config, layoutMarkerData, layoutContext, depth, generationCount);
    collectedFlexItemsValues.remainingFreeSpace = originalFreeSpace - distributedFreeSpace;
}
export function YGJustifyMainAxis(node, collectedFlexItemsValues, startOfLineIndex, mainAxis, crossAxis, measureModeMainDim, measureModeCrossDim, mainAxisownerSize, ownerWidth, availableInnerMainDim, availableInnerCrossDim, availableInnerWidth, performLayout, layoutContext) {
    const style = node.getStyle();
    const leadingPaddingAndBorderMain = node.getLeadingPaddingAndBorder(mainAxis, ownerWidth).unwrap();
    const trailingPaddingAndBorderMain = node.getTrailingPaddingAndBorder(mainAxis, ownerWidth).unwrap();
    // If we are using "at most" rules in the main axis, make sure that
    // remainingFreeSpace is 0 when min main dimension is not given
    if (measureModeMainDim == YGMeasureMode.AtMost && collectedFlexItemsValues.remainingFreeSpace > 0) {
        if (!style.minDimensions[dim[mainAxis]].isUndefined() &&
            !YGResolveValue(style.minDimensions[dim[mainAxis]], mainAxisownerSize).isUndefined()) {
            // This condition makes sure that if the size of main dimension(after
            // considering child nodes main dim, leading and trailing padding etc)
            // falls below min dimension, then the remainingFreeSpace is reassigned
            // considering the min dimension
            // `minAvailableMainDim` denotes minimum available space in which child
            // can be laid out, it will exclude space consumed by padding and border.
            const minAvailableMainDim = YGResolveValue(style.minDimensions[dim[mainAxis]], mainAxisownerSize).unwrap() -
                leadingPaddingAndBorderMain -
                trailingPaddingAndBorderMain;
            const occupiedSpaceByChildNodes = availableInnerMainDim - collectedFlexItemsValues.remainingFreeSpace;
            collectedFlexItemsValues.remainingFreeSpace = YGFloatMax(0, minAvailableMainDim - occupiedSpaceByChildNodes);
        }
        else {
            collectedFlexItemsValues.remainingFreeSpace = 0;
        }
    }
    let numberOfAutoMarginsOnCurrentLine = 0;
    for (let i = startOfLineIndex; i < collectedFlexItemsValues.endOfLineIndex; i++) {
        const child = node.getChild(i);
        if (child.getStyle().positionType != YGPositionType.Absolute) {
            if (child.marginLeadingValue(mainAxis).unit == YGUnit.Auto) {
                numberOfAutoMarginsOnCurrentLine++;
            }
            if (child.marginTrailingValue(mainAxis).unit == YGUnit.Auto) {
                numberOfAutoMarginsOnCurrentLine++;
            }
        }
    }
    // In order to position the elements in the main axis, we have two controls.
    // The space between the beginning and the first element and the space between
    // each two elements.
    let leadingMainDim = 0;
    let betweenMainDim = 0;
    const justifyContent = node.getStyle().justifyContent;
    if (numberOfAutoMarginsOnCurrentLine == 0) {
        switch (justifyContent) {
            case YGJustify.Center:
                leadingMainDim = collectedFlexItemsValues.remainingFreeSpace / 2;
                break;
            case YGJustify.FlexEnd:
                leadingMainDim = collectedFlexItemsValues.remainingFreeSpace;
                break;
            case YGJustify.SpaceBetween:
                if (collectedFlexItemsValues.itemsOnLine > 1) {
                    betweenMainDim =
                        YGFloatMax(collectedFlexItemsValues.remainingFreeSpace, 0) /
                            (collectedFlexItemsValues.itemsOnLine - 1);
                }
                else {
                    betweenMainDim = 0;
                }
                break;
            case YGJustify.SpaceEvenly:
                // Space is distributed evenly across all elements
                betweenMainDim =
                    collectedFlexItemsValues.remainingFreeSpace / (collectedFlexItemsValues.itemsOnLine + 1);
                leadingMainDim = betweenMainDim;
                break;
            case YGJustify.SpaceAround:
                // Space on the edges is half of the space between elements
                betweenMainDim = collectedFlexItemsValues.remainingFreeSpace / collectedFlexItemsValues.itemsOnLine;
                leadingMainDim = betweenMainDim / 2;
                break;
            case YGJustify.FlexStart:
                break;
        }
    }
    collectedFlexItemsValues.mainDim = leadingPaddingAndBorderMain + leadingMainDim;
    collectedFlexItemsValues.crossDim = 0;
    let maxAscentForCurrentLine = 0;
    let maxDescentForCurrentLine = 0;
    const isNodeBaselineLayout = YGIsBaselineLayout(node);
    for (let i = startOfLineIndex; i < collectedFlexItemsValues.endOfLineIndex; i++) {
        const child = node.getChild(i);
        const childStyle = child.getStyle();
        const childLayout = child.getLayout();
        if (childStyle.display == YGDisplay.None) {
            continue;
        }
        if (childStyle.positionType == YGPositionType.Absolute && child.isLeadingPositionDefined(mainAxis)) {
            if (performLayout) {
                // In case the child is position absolute and has left/top being
                // defined, we override the position to whatever the user said (and
                // margin/border).
                child.setLayoutPosition(child.getLeadingPosition(mainAxis, availableInnerMainDim).unwrap() +
                    node.getLeadingBorder(mainAxis) +
                    child.getLeadingMargin(mainAxis, availableInnerWidth).unwrap(), pos[mainAxis]);
            }
        }
        else {
            // Now that we placed the element, we need to update the variables.
            // We need to do that only for relative elements. Absolute elements do not
            // take part in that phase.
            if (childStyle.positionType != YGPositionType.Absolute) {
                if (child.marginLeadingValue(mainAxis).unit == YGUnit.Auto) {
                    collectedFlexItemsValues.mainDim +=
                        collectedFlexItemsValues.remainingFreeSpace / numberOfAutoMarginsOnCurrentLine;
                }
                if (performLayout) {
                    child.setLayoutPosition(childLayout.position[pos[mainAxis]] + collectedFlexItemsValues.mainDim, pos[mainAxis]);
                }
                if (child.marginTrailingValue(mainAxis).unit == YGUnit.Auto) {
                    collectedFlexItemsValues.mainDim +=
                        collectedFlexItemsValues.remainingFreeSpace / numberOfAutoMarginsOnCurrentLine;
                }
                const canSkipFlex = !performLayout && measureModeCrossDim == YGMeasureMode.Exactly;
                if (canSkipFlex) {
                    // If we skipped the flex step, then we can't rely on the measuredDims
                    // because they weren't computed. This means we can't call
                    // YGNodeDimWithMargin.
                    collectedFlexItemsValues.mainDim +=
                        betweenMainDim +
                            child.getMarginForAxis(mainAxis, availableInnerWidth).unwrap() +
                            childLayout.computedFlexBasis.unwrap();
                    collectedFlexItemsValues.crossDim = availableInnerCrossDim;
                }
                else {
                    // The main dimension is the sum of all the elements dimension plus
                    // the spacing.
                    collectedFlexItemsValues.mainDim +=
                        betweenMainDim + YGNodeDimWithMargin(child, mainAxis, availableInnerWidth);
                    if (isNodeBaselineLayout) {
                        // If the child is baseline aligned then the cross dimension is
                        // calculated by adding maxAscent and maxDescent from the baseline.
                        const ascent = YGBaseline(child, layoutContext) +
                            child.getLeadingMargin(YGFlexDirection.Column, availableInnerWidth).unwrap();
                        const descent = child.getLayout().measuredDimensions[YGDimension.Height] +
                            child.getMarginForAxis(YGFlexDirection.Column, availableInnerWidth).unwrap() -
                            ascent;
                        maxAscentForCurrentLine = YGFloatMax(maxAscentForCurrentLine, ascent);
                        maxDescentForCurrentLine = YGFloatMax(maxDescentForCurrentLine, descent);
                    }
                    else {
                        // The cross dimension is the max of the elements dimension since
                        // there can only be one element in that cross dimension in the case
                        // when the items are not baseline aligned
                        collectedFlexItemsValues.crossDim = YGFloatMax(collectedFlexItemsValues.crossDim, YGNodeDimWithMargin(child, crossAxis, availableInnerWidth));
                    }
                }
            }
            else if (performLayout) {
                child.setLayoutPosition(childLayout.position[pos[mainAxis]] + node.getLeadingBorder(mainAxis) + leadingMainDim, pos[mainAxis]);
            }
        }
    }
    collectedFlexItemsValues.mainDim += trailingPaddingAndBorderMain;
    if (isNodeBaselineLayout) {
        collectedFlexItemsValues.crossDim = maxAscentForCurrentLine + maxDescentForCurrentLine;
    }
}
export function YGNodelayoutImpl(node, availableWidth, availableHeight, ownerDirection, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, performLayout, config, layoutMarkerData, layoutContext, depth, generationCount, reason) {
    YGAssertWithNode(node, YGFloatIsUndefined(availableWidth) ? widthMeasureMode == YGMeasureMode.Undefined : true, 'availableWidth is indefinite so widthMeasureMode must be YGMeasureMode.Undefined');
    YGAssertWithNode(node, YGFloatIsUndefined(availableHeight) ? heightMeasureMode == YGMeasureMode.Undefined : true, 'availableHeight is indefinite so heightMeasureMode must be YGMeasureMode.Undefined');
    // (performLayout ? layoutMarkerData.layouts : layoutMarkerData.measures) += 1;
    // deviation: left-hand side can only be a variable or a binding expression.
    if (performLayout) {
        layoutMarkerData.layouts += 1;
    }
    else {
        layoutMarkerData.measures += 1;
    }
    const direction = node.resolveDirection(ownerDirection);
    node.setLayoutDirection(direction);
    const flexRowDirection = YGResolveFlexDirection(YGFlexDirection.Row, direction);
    const flexColumnDirection = YGResolveFlexDirection(YGFlexDirection.Column, direction);
    const startEdge = direction == YGDirection.LTR ? YGEdge.Left : YGEdge.Right;
    const endEdge = direction == YGDirection.LTR ? YGEdge.Right : YGEdge.Left;
    const marginRowLeading = node.getLeadingMargin(flexRowDirection, ownerWidth).unwrap();
    node.setLayoutMargin(marginRowLeading, startEdge);
    const marginRowTrailing = node.getTrailingMargin(flexRowDirection, ownerWidth).unwrap();
    node.setLayoutMargin(marginRowTrailing, endEdge);
    const marginColumnLeading = node.getLeadingMargin(flexColumnDirection, ownerWidth).unwrap();
    node.setLayoutMargin(marginColumnLeading, YGEdge.Top);
    const marginColumnTrailing = node.getTrailingMargin(flexColumnDirection, ownerWidth).unwrap();
    node.setLayoutMargin(marginColumnTrailing, YGEdge.Bottom);
    const marginAxisRow = marginRowLeading + marginRowTrailing;
    const marginAxisColumn = marginColumnLeading + marginColumnTrailing;
    node.setLayoutBorder(node.getLeadingBorder(flexRowDirection), startEdge);
    node.setLayoutBorder(node.getTrailingBorder(flexRowDirection), endEdge);
    node.setLayoutBorder(node.getLeadingBorder(flexColumnDirection), YGEdge.Top);
    node.setLayoutBorder(node.getTrailingBorder(flexColumnDirection), YGEdge.Bottom);
    node.setLayoutPadding(node.getLeadingPadding(flexRowDirection, ownerWidth).unwrap(), startEdge);
    node.setLayoutPadding(node.getTrailingPadding(flexRowDirection, ownerWidth).unwrap(), endEdge);
    node.setLayoutPadding(node.getLeadingPadding(flexColumnDirection, ownerWidth).unwrap(), YGEdge.Top);
    node.setLayoutPadding(node.getTrailingPadding(flexColumnDirection, ownerWidth).unwrap(), YGEdge.Bottom);
    if (node.hasMeasureFunc()) {
        YGNodeWithMeasureFuncSetMeasuredDimensions(node, availableWidth, availableHeight, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, layoutMarkerData, layoutContext, reason);
        return;
    }
    const childCount = YGNodeGetChildCount(node);
    if (childCount == 0) {
        YGNodeEmptyContainerSetMeasuredDimensions(node, availableWidth - marginAxisRow, availableHeight - marginAxisColumn, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight);
        return;
    }
    // If we're not being asked to perform a full layout we can skip the
    // algorithm if we already know the size
    if (!performLayout &&
        YGNodeFixedSizeSetMeasuredDimensions(node, availableWidth - marginAxisRow, availableHeight - marginAxisColumn, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight)) {
        return;
    }
    // At this point we know we're going to perform work. Ensure that each child
    // has a mutable copy.
    node.cloneChildrenIfNeeded(layoutContext);
    // Reset layout flags, as they could have changed.
    node.setLayoutHadOverflow(false);
    // STEP 1: CALCULATE VALUES FOR REMAINDER OF ALGORITHM
    const mainAxis = YGResolveFlexDirection(node.getStyle().flexDirection, direction);
    const crossAxis = YGFlexDirectionCross(mainAxis, direction);
    const isMainAxisRow = YGFlexDirectionIsRow(mainAxis);
    const isNodeFlexWrap = node.getStyle().flexWrap != YGWrap.NoWrap;
    const mainAxisownerSize = isMainAxisRow ? ownerWidth : ownerHeight;
    const crossAxisownerSize = isMainAxisRow ? ownerHeight : ownerWidth;
    const paddingAndBorderAxisMain = YGNodePaddingAndBorderForAxis(node, mainAxis, ownerWidth);
    const leadingPaddingAndBorderCross = node.getLeadingPaddingAndBorder(crossAxis, ownerWidth).unwrap();
    const trailingPaddingAndBorderCross = node.getTrailingPaddingAndBorder(crossAxis, ownerWidth).unwrap();
    const paddingAndBorderAxisCross = leadingPaddingAndBorderCross + trailingPaddingAndBorderCross;
    let measureModeMainDim = isMainAxisRow ? widthMeasureMode : heightMeasureMode;
    const measureModeCrossDim = isMainAxisRow ? heightMeasureMode : widthMeasureMode;
    const paddingAndBorderAxisRow = isMainAxisRow ? paddingAndBorderAxisMain : paddingAndBorderAxisCross;
    const paddingAndBorderAxisColumn = isMainAxisRow ? paddingAndBorderAxisCross : paddingAndBorderAxisMain;
    // STEP 2: DETERMINE AVAILABLE SIZE IN MAIN AND CROSS DIRECTIONS
    const availableInnerWidth = YGNodeCalculateAvailableInnerDim(node, YGDimension.Width, availableWidth - marginAxisRow, paddingAndBorderAxisRow, ownerWidth);
    const availableInnerHeight = YGNodeCalculateAvailableInnerDim(node, YGDimension.Height, availableHeight - marginAxisColumn, paddingAndBorderAxisColumn, ownerHeight);
    let availableInnerMainDim = isMainAxisRow ? availableInnerWidth : availableInnerHeight;
    const availableInnerCrossDim = isMainAxisRow ? availableInnerHeight : availableInnerWidth;
    // STEP 3: DETERMINE FLEX BASIS FOR EACH ITEM
    const totalOuterFlexBasis = YGNodeComputeFlexBasisForChildren(node, availableInnerWidth, availableInnerHeight, widthMeasureMode, heightMeasureMode, direction, mainAxis, config, performLayout, layoutMarkerData, layoutContext, depth, generationCount);
    const flexBasisOverflows = measureModeMainDim == YGMeasureMode.Undefined ? false : totalOuterFlexBasis > availableInnerMainDim;
    if (isNodeFlexWrap && flexBasisOverflows && measureModeMainDim == YGMeasureMode.AtMost) {
        measureModeMainDim = YGMeasureMode.Exactly;
    }
    // STEP 4: COLLECT FLEX ITEMS INTO FLEX LINES
    // Indexes of children that represent the first and last items in the line.
    let startOfLineIndex = 0;
    let endOfLineIndex = 0;
    // Number of lines.
    let lineCount = 0;
    // Accumulated cross dimensions of all lines so far.
    let totalLineCrossDim = 0;
    // Max main dimension of all the lines.
    let maxLineMainDim = 0;
    let collectedFlexItemsValues;
    for (; endOfLineIndex < childCount; lineCount++, startOfLineIndex = endOfLineIndex) {
        collectedFlexItemsValues = YGCalculateCollectFlexItemsRowValues(node, ownerDirection, mainAxisownerSize, availableInnerWidth, availableInnerMainDim, startOfLineIndex, lineCount);
        endOfLineIndex = collectedFlexItemsValues.endOfLineIndex;
        // If we don't need to measure the cross axis, we can skip the entire
        // flex step.
        const canSkipFlex = !performLayout && measureModeCrossDim == YGMeasureMode.Exactly;
        // STEP 5: RESOLVING FLEXIBLE LENGTHS ON MAIN AXIS
        // Calculate the remaining available space that needs to be allocated.
        // If the main dimension size isn't known, it is computed based on the
        // line length, so there's no more space left to distribute.
        let sizeBasedOnContent = false;
        // If we don't measure with exact main dimension we want to ensure we don't
        // violate min and max
        if (measureModeMainDim != YGMeasureMode.Exactly) {
            const minDimensions = node.getStyle().minDimensions;
            const maxDimensions = node.getStyle().maxDimensions;
            const minInnerWidth = YGResolveValue(minDimensions[YGDimension.Width], ownerWidth).unwrap() - paddingAndBorderAxisRow;
            const maxInnerWidth = YGResolveValue(maxDimensions[YGDimension.Width], ownerWidth).unwrap() - paddingAndBorderAxisRow;
            const minInnerHeight = YGResolveValue(minDimensions[YGDimension.Height], ownerHeight).unwrap() - paddingAndBorderAxisColumn;
            const maxInnerHeight = YGResolveValue(maxDimensions[YGDimension.Height], ownerHeight).unwrap() - paddingAndBorderAxisColumn;
            const minInnerMainDim = isMainAxisRow ? minInnerWidth : minInnerHeight;
            const maxInnerMainDim = isMainAxisRow ? maxInnerWidth : maxInnerHeight;
            if (!YGFloatIsUndefined(minInnerMainDim) &&
                collectedFlexItemsValues.sizeConsumedOnCurrentLine < minInnerMainDim) {
                availableInnerMainDim = minInnerMainDim;
            }
            else if (!YGFloatIsUndefined(maxInnerMainDim) &&
                collectedFlexItemsValues.sizeConsumedOnCurrentLine > maxInnerMainDim) {
                availableInnerMainDim = maxInnerMainDim;
            }
            else {
                if (!node.getConfig().useLegacyStretchBehaviour &&
                    ((YGFloatIsUndefined(collectedFlexItemsValues.totalFlexGrowFactors) &&
                        collectedFlexItemsValues.totalFlexGrowFactors == 0) ||
                        (YGFloatIsUndefined(node.resolveFlexGrow()) && node.resolveFlexGrow() == 0))) {
                    // If we don't have any children to flex or we can't flex
                    // the node itself, space we've used is all space we need.
                    // Root node also should be shrunk to minimum
                    availableInnerMainDim = collectedFlexItemsValues.sizeConsumedOnCurrentLine;
                }
                if (node.getConfig().useLegacyStretchBehaviour) {
                    node.setLayoutDidUseLegacyFlag(true);
                }
                sizeBasedOnContent = !node.getConfig().useLegacyStretchBehaviour;
            }
        }
        if (!sizeBasedOnContent && !YGFloatIsUndefined(availableInnerMainDim)) {
            collectedFlexItemsValues.remainingFreeSpace =
                availableInnerMainDim - collectedFlexItemsValues.sizeConsumedOnCurrentLine;
        }
        else if (collectedFlexItemsValues.sizeConsumedOnCurrentLine < 0) {
            // availableInnerMainDim is indefinite which means the node is being
            // sized based on its content. sizeConsumedOnCurrentLine is negative
            // which means the node will allocate 0 points for its content.
            // Consequently, remainingFreeSpace is 0 - sizeConsumedOnCurrentLine
            collectedFlexItemsValues.remainingFreeSpace = -collectedFlexItemsValues.sizeConsumedOnCurrentLine;
        }
        if (!canSkipFlex) {
            YGResolveFlexibleLength(node, collectedFlexItemsValues, mainAxis, crossAxis, mainAxisownerSize, availableInnerMainDim, availableInnerCrossDim, availableInnerWidth, availableInnerHeight, flexBasisOverflows, measureModeCrossDim, performLayout, config, layoutMarkerData, layoutContext, depth, generationCount);
        }
        // deviation: use logical OR instead of bitwise OR for boolean logic.
        node.setLayoutHadOverflow(node.getLayout().hadOverflow || collectedFlexItemsValues.remainingFreeSpace < 0);
        // STEP 6: MAIN-AXIS JUSTIFICATION & CROSS-AXIS SIZE DETERMINATION
        // At this point, all the children have their dimensions set in the main
        // axis. Their dimensions are also set in the cross axis with the
        // exception of items that are aligned "stretch". We need to compute
        // these stretch values and set the final positions.
        YGJustifyMainAxis(node, collectedFlexItemsValues, startOfLineIndex, mainAxis, crossAxis, measureModeMainDim, measureModeCrossDim, mainAxisownerSize, ownerWidth, availableInnerMainDim, availableInnerCrossDim, availableInnerWidth, performLayout, layoutContext);
        let containerCrossAxis = availableInnerCrossDim;
        if (measureModeCrossDim == YGMeasureMode.Undefined || measureModeCrossDim == YGMeasureMode.AtMost) {
            // Compute the cross axis from the max cross dimension of the children.
            containerCrossAxis =
                YGNodeBoundAxis(node, crossAxis, collectedFlexItemsValues.crossDim + paddingAndBorderAxisCross, crossAxisownerSize, ownerWidth) - paddingAndBorderAxisCross;
        }
        // If there's no flex wrap, the cross dimension is defined by the container.
        if (!isNodeFlexWrap && measureModeCrossDim == YGMeasureMode.Exactly) {
            collectedFlexItemsValues.crossDim = availableInnerCrossDim;
        }
        // Clamp to the min/max size specified on the container.
        collectedFlexItemsValues.crossDim =
            YGNodeBoundAxis(node, crossAxis, collectedFlexItemsValues.crossDim + paddingAndBorderAxisCross, crossAxisownerSize, ownerWidth) - paddingAndBorderAxisCross;
        // STEP 7: CROSS-AXIS ALIGNMENT
        // We can skip child alignment if we're just measuring the container.
        if (performLayout) {
            for (let i = startOfLineIndex; i < endOfLineIndex; i++) {
                const child = node.getChild(i);
                if (child.getStyle().display == YGDisplay.None) {
                    continue;
                }
                if (child.getStyle().positionType == YGPositionType.Absolute) {
                    // If the child is absolutely positioned and has a
                    // top/left/bottom/right set, override all the previously computed
                    // positions to set it correctly.
                    const isChildLeadingPosDefined = child.isLeadingPositionDefined(crossAxis);
                    if (isChildLeadingPosDefined) {
                        child.setLayoutPosition(child.getLeadingPosition(crossAxis, availableInnerCrossDim).unwrap() +
                            node.getLeadingBorder(crossAxis) +
                            child.getLeadingMargin(crossAxis, availableInnerWidth).unwrap(), pos[crossAxis]);
                    }
                    // If leading position is not defined or calculations result in Nan,
                    // default to border + margin
                    if (!isChildLeadingPosDefined || YGFloatIsUndefined(child.getLayout().position[pos[crossAxis]])) {
                        child.setLayoutPosition(node.getLeadingBorder(crossAxis) +
                            child.getLeadingMargin(crossAxis, availableInnerWidth).unwrap(), pos[crossAxis]);
                    }
                }
                else {
                    let leadingCrossDim = leadingPaddingAndBorderCross;
                    // For a relative children, we're either using alignItems (owner) or
                    // alignSelf (child) in order to determine the position in the cross
                    // axis
                    const alignItem = YGNodeAlignItem(node, child);
                    // If the child uses align stretch, we need to lay it out one more
                    // time, this time forcing the cross-axis size to be the computed
                    // cross size for the current line.
                    if (alignItem == YGAlign.Stretch &&
                        child.marginLeadingValue(crossAxis).unit != YGUnit.Auto &&
                        child.marginTrailingValue(crossAxis).unit != YGUnit.Auto) {
                        // If the child defines a definite size for its cross axis,
                        // there's no need to stretch.
                        if (!YGNodeIsStyleDimDefined(child, crossAxis, availableInnerCrossDim)) {
                            let childMainSize = child.getLayout().measuredDimensions[dim[mainAxis]];
                            const childStyle = child.getStyle();
                            const childCrossSize = !childStyle.aspectRatio.isUndefined()
                                ? child.getMarginForAxis(crossAxis, availableInnerWidth).unwrap() +
                                    (isMainAxisRow
                                        ? childMainSize / childStyle.aspectRatio.unwrap()
                                        : childMainSize * childStyle.aspectRatio.unwrap())
                                : collectedFlexItemsValues.crossDim;
                            childMainSize += child.getMarginForAxis(mainAxis, availableInnerWidth).unwrap();
                            const childMainMeasureMode = YGMeasureMode.Exactly;
                            const childCrossMeasureMode = YGMeasureMode.Exactly;
                            const childMainMeasureModeRef = { value: childMainMeasureMode };
                            const childMainSizeRef = { value: childMainSize };
                            const childCrossMeasureModeRef = { value: childCrossMeasureMode };
                            const childCrossSizeRef = { value: childCrossSize };
                            YGConstrainMaxSizeForMode(child, mainAxis, availableInnerMainDim, availableInnerWidth, childMainMeasureModeRef, childMainSizeRef);
                            YGConstrainMaxSizeForMode(child, crossAxis, availableInnerCrossDim, availableInnerWidth, childCrossMeasureModeRef, childCrossSizeRef);
                            const childWidth = isMainAxisRow ? childMainSize : childCrossSize;
                            const childHeight = !isMainAxisRow ? childMainSize : childCrossSize;
                            const alignContent = node.getStyle().alignContent;
                            const crossAxisDoesNotGrow = alignContent != YGAlign.Stretch && isNodeFlexWrap;
                            const childWidthMeasureMode = YGFloatIsUndefined(childWidth) || (!isMainAxisRow && crossAxisDoesNotGrow)
                                ? YGMeasureMode.Undefined
                                : YGMeasureMode.Exactly;
                            const childHeightMeasureMode = YGFloatIsUndefined(childHeight) || (isMainAxisRow && crossAxisDoesNotGrow)
                                ? YGMeasureMode.Undefined
                                : YGMeasureMode.Exactly;
                            YGLayoutNodeInternal(child, childWidth, childHeight, direction, childWidthMeasureMode, childHeightMeasureMode, availableInnerWidth, availableInnerHeight, true, LayoutPassReason.kStretch, config, layoutMarkerData, layoutContext, depth, generationCount);
                        }
                    }
                    else {
                        const remainingCrossDim = containerCrossAxis - YGNodeDimWithMargin(child, crossAxis, availableInnerWidth);
                        if (child.marginLeadingValue(crossAxis).unit == YGUnit.Auto &&
                            child.marginTrailingValue(crossAxis).unit == YGUnit.Auto) {
                            leadingCrossDim += YGFloatMax(0.0, remainingCrossDim / 2);
                        }
                        else if (child.marginTrailingValue(crossAxis).unit == YGUnit.Auto) {
                            // No-Op
                        }
                        else if (child.marginLeadingValue(crossAxis).unit == YGUnit.Auto) {
                            leadingCrossDim += YGFloatMax(0.0, remainingCrossDim);
                        }
                        else if (alignItem == YGAlign.FlexStart) {
                            // No-Op
                        }
                        else if (alignItem == YGAlign.Center) {
                            leadingCrossDim += remainingCrossDim / 2;
                        }
                        else {
                            leadingCrossDim += remainingCrossDim;
                        }
                    }
                    // And we apply the position
                    child.setLayoutPosition(child.getLayout().position[pos[crossAxis]] + totalLineCrossDim + leadingCrossDim, pos[crossAxis]);
                }
            }
        }
        totalLineCrossDim += collectedFlexItemsValues.crossDim;
        maxLineMainDim = YGFloatMax(maxLineMainDim, collectedFlexItemsValues.mainDim);
    }
    // STEP 8: MULTI-LINE CONTENT ALIGNMENT
    // currentLead stores the size of the cross dim
    if (performLayout && (isNodeFlexWrap || YGIsBaselineLayout(node))) {
        let crossDimLead = 0;
        let currentLead = leadingPaddingAndBorderCross;
        if (!YGFloatIsUndefined(availableInnerCrossDim)) {
            const remainingAlignContentDim = availableInnerCrossDim - totalLineCrossDim;
            switch (node.getStyle().alignContent) {
                case YGAlign.FlexEnd:
                    currentLead += remainingAlignContentDim;
                    break;
                case YGAlign.Center:
                    currentLead += remainingAlignContentDim / 2;
                    break;
                case YGAlign.Stretch:
                    if (availableInnerCrossDim > totalLineCrossDim) {
                        crossDimLead = remainingAlignContentDim / lineCount;
                    }
                    break;
                case YGAlign.SpaceAround:
                    if (availableInnerCrossDim > totalLineCrossDim) {
                        currentLead += remainingAlignContentDim / (2 * lineCount);
                        if (lineCount > 1) {
                            crossDimLead = remainingAlignContentDim / lineCount;
                        }
                    }
                    else {
                        currentLead += remainingAlignContentDim / 2;
                    }
                    break;
                case YGAlign.SpaceBetween:
                    if (availableInnerCrossDim > totalLineCrossDim && lineCount > 1) {
                        crossDimLead = remainingAlignContentDim / (lineCount - 1);
                    }
                    break;
                case YGAlign.Auto:
                case YGAlign.FlexStart:
                case YGAlign.Baseline:
                    break;
            }
        }
        let endIndex = 0;
        for (let i = 0; i < lineCount; i++) {
            const startIndex = endIndex;
            let ii;
            // compute the line's height and find the endIndex
            let lineHeight = 0;
            let maxAscentForCurrentLine = 0;
            let maxDescentForCurrentLine = 0;
            for (ii = startIndex; ii < childCount; ii++) {
                const child = node.getChild(ii);
                if (child.getStyle().display == YGDisplay.None) {
                    continue;
                }
                if (child.getStyle().positionType != YGPositionType.Absolute) {
                    if (child.getLineIndex() != i) {
                        break;
                    }
                    if (YGNodeIsLayoutDimDefined(child, crossAxis)) {
                        lineHeight = YGFloatMax(lineHeight, child.getLayout().measuredDimensions[dim[crossAxis]] +
                            child.getMarginForAxis(crossAxis, availableInnerWidth).unwrap());
                    }
                    if (YGNodeAlignItem(node, child) == YGAlign.Baseline) {
                        const ascent = YGBaseline(child, layoutContext) +
                            child.getLeadingMargin(YGFlexDirection.Column, availableInnerWidth).unwrap();
                        const descent = child.getLayout().measuredDimensions[YGDimension.Height] +
                            child.getMarginForAxis(YGFlexDirection.Column, availableInnerWidth).unwrap() -
                            ascent;
                        maxAscentForCurrentLine = YGFloatMax(maxAscentForCurrentLine, ascent);
                        maxDescentForCurrentLine = YGFloatMax(maxDescentForCurrentLine, descent);
                        lineHeight = YGFloatMax(lineHeight, maxAscentForCurrentLine + maxDescentForCurrentLine);
                    }
                }
            }
            endIndex = ii;
            lineHeight += crossDimLead;
            if (performLayout) {
                for (ii = startIndex; ii < endIndex; ii++) {
                    const child = node.getChild(ii);
                    if (child.getStyle().display == YGDisplay.None) {
                        continue;
                    }
                    if (child.getStyle().positionType != YGPositionType.Absolute) {
                        switch (YGNodeAlignItem(node, child)) {
                            case YGAlign.FlexStart: {
                                child.setLayoutPosition(currentLead + child.getLeadingMargin(crossAxis, availableInnerWidth).unwrap(), pos[crossAxis]);
                                break;
                            }
                            case YGAlign.FlexEnd: {
                                child.setLayoutPosition(currentLead +
                                    lineHeight -
                                    child.getTrailingMargin(crossAxis, availableInnerWidth).unwrap() -
                                    child.getLayout().measuredDimensions[dim[crossAxis]], pos[crossAxis]);
                                break;
                            }
                            case YGAlign.Center: {
                                const childHeight = child.getLayout().measuredDimensions[dim[crossAxis]];
                                child.setLayoutPosition(currentLead + (lineHeight - childHeight) / 2, pos[crossAxis]);
                                break;
                            }
                            case YGAlign.Stretch: {
                                child.setLayoutPosition(currentLead + child.getLeadingMargin(crossAxis, availableInnerWidth).unwrap(), pos[crossAxis]);
                                // Remeasure child with the line height as it as been only
                                // measured with the owners height yet.
                                if (!YGNodeIsStyleDimDefined(child, crossAxis, availableInnerCrossDim)) {
                                    const childWidth = isMainAxisRow
                                        ? child.getLayout().measuredDimensions[YGDimension.Width] +
                                            child.getMarginForAxis(mainAxis, availableInnerWidth).unwrap()
                                        : lineHeight;
                                    const childHeight = !isMainAxisRow
                                        ? child.getLayout().measuredDimensions[YGDimension.Height] +
                                            child.getMarginForAxis(crossAxis, availableInnerWidth).unwrap()
                                        : lineHeight;
                                    if (!(YGFloatsEqual(childWidth, child.getLayout().measuredDimensions[YGDimension.Width]) &&
                                        YGFloatsEqual(childHeight, child.getLayout().measuredDimensions[YGDimension.Height]))) {
                                        YGLayoutNodeInternal(child, childWidth, childHeight, direction, YGMeasureMode.Exactly, YGMeasureMode.Exactly, availableInnerWidth, availableInnerHeight, true, LayoutPassReason.kMultilineStretch, config, layoutMarkerData, layoutContext, depth, generationCount);
                                    }
                                }
                                break;
                            }
                            case YGAlign.Baseline: {
                                child.setLayoutPosition(currentLead +
                                    maxAscentForCurrentLine -
                                    YGBaseline(child, layoutContext) +
                                    child
                                        .getLeadingPosition(YGFlexDirection.Column, availableInnerCrossDim)
                                        .unwrap(), YGEdge.Top);
                                break;
                            }
                            case YGAlign.Auto:
                            case YGAlign.SpaceBetween:
                            case YGAlign.SpaceAround:
                                break;
                        }
                    }
                }
            }
            currentLead += lineHeight;
        }
    }
    // STEP 9: COMPUTING FINAL DIMENSIONS
    node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Row, availableWidth - marginAxisRow, ownerWidth, ownerWidth), YGDimension.Width);
    node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, YGFlexDirection.Column, availableHeight - marginAxisColumn, ownerHeight, ownerWidth), YGDimension.Height);
    // If the user didn't specify a width or height for the node, set the
    // dimensions based on the children.
    if (measureModeMainDim == YGMeasureMode.Undefined ||
        (node.getStyle().overflow != YGOverflow.Scroll && measureModeMainDim == YGMeasureMode.AtMost)) {
        // Clamp the size to the min/max size, if specified, and make sure it
        // doesn't go below the padding and border amount.
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, mainAxis, maxLineMainDim, mainAxisownerSize, ownerWidth), dim[mainAxis]);
    }
    else if (measureModeMainDim == YGMeasureMode.AtMost && node.getStyle().overflow == YGOverflow.Scroll) {
        node.setLayoutMeasuredDimension(YGFloatMax(YGFloatMin(availableInnerMainDim + paddingAndBorderAxisMain, YGNodeBoundAxisWithinMinAndMax(node, mainAxis, new YGFloatOptional(maxLineMainDim), mainAxisownerSize).unwrap()), paddingAndBorderAxisMain), dim[mainAxis]);
    }
    if (measureModeCrossDim == YGMeasureMode.Undefined ||
        (node.getStyle().overflow != YGOverflow.Scroll && measureModeCrossDim == YGMeasureMode.AtMost)) {
        // Clamp the size to the min/max size, if specified, and make sure it
        // doesn't go below the padding and border amount.
        node.setLayoutMeasuredDimension(YGNodeBoundAxis(node, crossAxis, totalLineCrossDim + paddingAndBorderAxisCross, crossAxisownerSize, ownerWidth), dim[crossAxis]);
    }
    else if (measureModeCrossDim == YGMeasureMode.AtMost && node.getStyle().overflow == YGOverflow.Scroll) {
        node.setLayoutMeasuredDimension(YGFloatMax(YGFloatMin(availableInnerCrossDim + paddingAndBorderAxisCross, YGNodeBoundAxisWithinMinAndMax(node, crossAxis, new YGFloatOptional(totalLineCrossDim + paddingAndBorderAxisCross), crossAxisownerSize).unwrap()), paddingAndBorderAxisCross), dim[crossAxis]);
    }
    // As we only wrapped in normal direction yet, we need to reverse the
    // positions on wrap-reverse.
    if (performLayout && node.getStyle().flexWrap == YGWrap.WrapReverse) {
        for (let i = 0; i < childCount; i++) {
            const child = YGNodeGetChild(node, i);
            if (child.getStyle().positionType != YGPositionType.Absolute) {
                child.setLayoutPosition(node.getLayout().measuredDimensions[dim[crossAxis]] -
                    child.getLayout().position[pos[crossAxis]] -
                    child.getLayout().measuredDimensions[dim[crossAxis]], pos[crossAxis]);
            }
        }
    }
    if (performLayout) {
        // STEP 10: SIZING AND POSITIONING ABSOLUTE CHILDREN
        const children = node.getChildren();
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            if (child.getStyle().display == YGDisplay.None ||
                child.getStyle().positionType != YGPositionType.Absolute) {
                continue;
            }
            YGNodeAbsoluteLayoutChild(node, child, availableInnerWidth, isMainAxisRow ? measureModeMainDim : measureModeCrossDim, availableInnerHeight, direction, config, layoutMarkerData, layoutContext, depth, generationCount);
        }
        // STEP 11: SETTING TRAILING POSITIONS FOR CHILDREN
        const needsMainTrailingPos = mainAxis == YGFlexDirection.RowReverse || mainAxis == YGFlexDirection.ColumnReverse;
        const needsCrossTrailingPos = crossAxis == YGFlexDirection.RowReverse || crossAxis == YGFlexDirection.ColumnReverse;
        // Set trailing position if necessary.
        if (needsMainTrailingPos || needsCrossTrailingPos) {
            for (let i = 0; i < childCount; i++) {
                const child = node.getChild(i);
                if (child.getStyle().display == YGDisplay.None) {
                    continue;
                }
                if (needsMainTrailingPos) {
                    YGNodeSetChildTrailingPosition(node, child, mainAxis);
                }
                if (needsCrossTrailingPos) {
                    YGNodeSetChildTrailingPosition(node, child, crossAxis);
                }
            }
        }
    }
}
const gPrintChanges = false;
const gPrintSkips = false;
const spacer = '                                                            ';
export function YGSpacer(level) {
    const spacerLen = spacer.length;
    if (level > spacerLen) {
        return spacer;
    }
    else {
        return spacer.substr(spacerLen - level);
    }
}
export function YGMeasureModeName(mode, performLayout) {
    const kMeasureModeNames = ['UNDEFINED', 'EXACTLY', 'AT_MOST'];
    const kLayoutModeNames = ['LAY_UNDEFINED', 'LAY_EXACTLY', 'LAY_AT_', 'MOST'];
    if (mode >= YGMeasureModeCount) {
        return '';
    }
    return performLayout ? kLayoutModeNames[mode] : kMeasureModeNames[mode];
}
export function YGMeasureModeSizeIsExactAndMatchesOldMeasuredSize(sizeMode, size, lastComputedSize) {
    return sizeMode == YGMeasureMode.Exactly && YGFloatsEqual(size, lastComputedSize);
}
export function YGMeasureModeOldSizeIsUnspecifiedAndStillFits(sizeMode, size, lastSizeMode, lastComputedSize) {
    return (sizeMode == YGMeasureMode.AtMost &&
        lastSizeMode == YGMeasureMode.Undefined &&
        (size >= lastComputedSize || YGFloatsEqual(size, lastComputedSize)));
}
export function YGMeasureModeNewMeasureSizeIsStricterAndStillValid(sizeMode, size, lastSizeMode, lastSize, lastComputedSize) {
    return (lastSizeMode == YGMeasureMode.AtMost &&
        sizeMode == YGMeasureMode.AtMost &&
        !YGFloatIsUndefined(lastSize) &&
        !YGFloatIsUndefined(size) &&
        !YGFloatIsUndefined(lastComputedSize) &&
        lastSize > size &&
        (lastComputedSize <= size || YGFloatsEqual(size, lastComputedSize)));
}
export function YGRoundValueToPixelGrid(value, pointScaleFactor, forceCeil, forceFloor) {
    let scaledValue = value * pointScaleFactor;
    const fractial = scaledValue % 1.0;
    if (YGFloatsEqual(fractial, 0)) {
        scaledValue = scaledValue - fractial;
    }
    else if (YGFloatsEqual(fractial, 1.0)) {
        scaledValue = scaledValue - fractial + 1.0;
    }
    else if (forceCeil) {
        scaledValue = scaledValue - fractial + 1.0;
    }
    else if (forceFloor) {
        scaledValue = scaledValue - fractial;
    }
    else {
        scaledValue =
            scaledValue -
                fractial +
                (!YGFloatIsUndefined(fractial) && (fractial > 0.5 || YGFloatsEqual(fractial, 0.5)) ? 1.0 : 0.0);
    }
    return YGFloatIsUndefined(scaledValue) || YGFloatIsUndefined(pointScaleFactor)
        ? YGUndefined
        : scaledValue / pointScaleFactor;
}
export function YGNodeCanUseCachedMeasurement(widthMode, width, heightMode, height, lastWidthMode, lastWidth, lastHeightMode, lastHeight, lastComputedWidth, lastComputedHeight, marginRow, marginColumn, config) {
    if ((!YGFloatIsUndefined(lastComputedHeight) && lastComputedHeight < 0) ||
        (!YGFloatIsUndefined(lastComputedWidth) && lastComputedWidth < 0)) {
        return false;
    }
    const useRoundedComparison = config != null && config.pointScaleFactor != 0;
    const effectiveWidth = useRoundedComparison
        ? YGRoundValueToPixelGrid(width, config.pointScaleFactor, false, false)
        : width;
    const effectiveHeight = useRoundedComparison
        ? YGRoundValueToPixelGrid(height, config.pointScaleFactor, false, false)
        : height;
    const effectiveLastWidth = useRoundedComparison
        ? YGRoundValueToPixelGrid(lastWidth, config.pointScaleFactor, false, false)
        : lastWidth;
    const effectiveLastHeight = useRoundedComparison
        ? YGRoundValueToPixelGrid(lastHeight, config.pointScaleFactor, false, false)
        : lastHeight;
    const hasSameWidthSpec = lastWidthMode == widthMode && YGFloatsEqual(effectiveLastWidth, effectiveWidth);
    const hasSameHeightSpec = lastHeightMode == heightMode && YGFloatsEqual(effectiveLastHeight, effectiveHeight);
    const widthIsCompatible = hasSameWidthSpec ||
        YGMeasureModeSizeIsExactAndMatchesOldMeasuredSize(widthMode, width - marginRow, lastComputedWidth) ||
        YGMeasureModeOldSizeIsUnspecifiedAndStillFits(widthMode, width - marginRow, lastWidthMode, lastComputedWidth) ||
        YGMeasureModeNewMeasureSizeIsStricterAndStillValid(widthMode, width - marginRow, lastWidthMode, lastWidth, lastComputedWidth);
    const heightIsCompatible = hasSameHeightSpec ||
        YGMeasureModeSizeIsExactAndMatchesOldMeasuredSize(heightMode, height - marginColumn, lastComputedHeight) ||
        YGMeasureModeOldSizeIsUnspecifiedAndStillFits(heightMode, height - marginColumn, lastHeightMode, lastComputedHeight) ||
        YGMeasureModeNewMeasureSizeIsStricterAndStillValid(heightMode, height - marginColumn, lastHeightMode, lastHeight, lastComputedHeight);
    return widthIsCompatible && heightIsCompatible;
}
export function YGLayoutNodeInternal(node, availableWidth, availableHeight, ownerDirection, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, performLayout, reason, config, layoutMarkerData, layoutContext, depth, generationCount) {
    const layout = node.getLayout();
    depth++;
    const needToVisitNode = (node.isDirty() && layout.generationCount != generationCount) || layout.lastOwnerDirection != ownerDirection;
    if (needToVisitNode) {
        // Invalidate the cached results.
        layout.nextCachedMeasurementsIndex = 0;
        layout.cachedLayout.availableWidth = -1;
        layout.cachedLayout.availableHeight = -1;
        layout.cachedLayout.widthMeasureMode = YGMeasureMode.Undefined;
        layout.cachedLayout.heightMeasureMode = YGMeasureMode.Undefined;
        layout.cachedLayout.computedWidth = -1;
        layout.cachedLayout.computedHeight = -1;
    }
    let cachedResults = null;
    // Determine whether the results are already cached. We maintain a separate
    // cache for layouts and measurements. A layout operation modifies the
    // positions and dimensions for nodes in the subtree. The algorithm assumes
    // that each node gets layed out a maximum of one time per tree layout, but
    // multiple measurements may be required to resolve all of the flex
    // dimensions. We handle nodes with measure functions specially here because
    // they are the most expensive to measure, so it's worth avoiding redundant
    // measurements if at all possible.
    if (node.hasMeasureFunc()) {
        const marginAxisRow = node.getMarginForAxis(YGFlexDirection.Row, ownerWidth).unwrap();
        const marginAxisColumn = node.getMarginForAxis(YGFlexDirection.Column, ownerWidth).unwrap();
        // First, try to use the layout cache.
        if (YGNodeCanUseCachedMeasurement(widthMeasureMode, availableWidth, heightMeasureMode, availableHeight, layout.cachedLayout.widthMeasureMode, layout.cachedLayout.availableWidth, layout.cachedLayout.heightMeasureMode, layout.cachedLayout.availableHeight, layout.cachedLayout.computedWidth, layout.cachedLayout.computedHeight, marginAxisRow, marginAxisColumn, config)) {
            cachedResults = layout.cachedLayout;
        }
        else {
            // Try to use the measurement cache.
            for (let i = 0; i < layout.nextCachedMeasurementsIndex; i++) {
                if (YGNodeCanUseCachedMeasurement(widthMeasureMode, availableWidth, heightMeasureMode, availableHeight, layout.cachedMeasurements[i].widthMeasureMode, layout.cachedMeasurements[i].availableWidth, layout.cachedMeasurements[i].heightMeasureMode, layout.cachedMeasurements[i].availableHeight, layout.cachedMeasurements[i].computedWidth, layout.cachedMeasurements[i].computedHeight, marginAxisRow, marginAxisColumn, config)) {
                    cachedResults = layout.cachedMeasurements[i];
                    break;
                }
            }
        }
    }
    else if (performLayout) {
        if (YGFloatsEqual(layout.cachedLayout.availableWidth, availableWidth) &&
            YGFloatsEqual(layout.cachedLayout.availableHeight, availableHeight) &&
            layout.cachedLayout.widthMeasureMode == widthMeasureMode &&
            layout.cachedLayout.heightMeasureMode == heightMeasureMode) {
            cachedResults = layout.cachedLayout;
        }
    }
    else {
        for (let i = 0; i < layout.nextCachedMeasurementsIndex; i++) {
            if (YGFloatsEqual(layout.cachedMeasurements[i].availableWidth, availableWidth) &&
                YGFloatsEqual(layout.cachedMeasurements[i].availableHeight, availableHeight) &&
                layout.cachedMeasurements[i].widthMeasureMode == widthMeasureMode &&
                layout.cachedMeasurements[i].heightMeasureMode == heightMeasureMode) {
                cachedResults = layout.cachedMeasurements[i];
                break;
            }
        }
    }
    if (!needToVisitNode && cachedResults != null) {
        layout.measuredDimensions[YGDimension.Width] = cachedResults.computedWidth;
        layout.measuredDimensions[YGDimension.Height] = cachedResults.computedHeight;
        // (performLayout ? layoutMarkerData.cachedLayouts : layoutMarkerData.cachedMeasures) += 1;
        // deviation: left-hand side assignment must be variable in TS.
        if (performLayout) {
            layoutMarkerData.cachedLayouts += 1;
        }
        else {
            layoutMarkerData.cachedMeasures += 1;
        }
        if (gPrintChanges && gPrintSkips) {
            Log.log(node, YGLogLevel.Verbose, null, '%s%d.{[skipped] ', YGSpacer(depth), depth);
            node.print(layoutContext);
            Log.log(node, YGLogLevel.Verbose, null, 'wm: %s, hm: %s, aw: %f ah: %f => d: (%f, %f) %s\n', YGMeasureModeName(widthMeasureMode, performLayout), YGMeasureModeName(heightMeasureMode, performLayout), availableWidth, availableHeight, cachedResults.computedWidth, cachedResults.computedHeight, reason);
        }
    }
    else {
        if (gPrintChanges) {
            Log.log(node, YGLogLevel.Verbose, null, '%s%d.{%s', YGSpacer(depth), depth, needToVisitNode ? '*' : '');
            node.print(layoutContext);
            Log.log(node, YGLogLevel.Verbose, null, 'wm: %s, hm: %s, aw: %f ah: %f %s\n', YGMeasureModeName(widthMeasureMode, performLayout), YGMeasureModeName(heightMeasureMode, performLayout), availableWidth, availableHeight, reason);
        }
        YGNodelayoutImpl(node, availableWidth, availableHeight, ownerDirection, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, performLayout, config, layoutMarkerData, layoutContext, depth, generationCount, reason);
        if (gPrintChanges) {
            Log.log(node, YGLogLevel.Verbose, null, '%s%d.}%s', YGSpacer(depth), depth, needToVisitNode ? '*' : '');
            node.print(layoutContext);
            Log.log(node, YGLogLevel.Verbose, null, 'wm: %s, hm: %s, d: (%f, %f) %s\n', YGMeasureModeName(widthMeasureMode, performLayout), YGMeasureModeName(heightMeasureMode, performLayout), layout.measuredDimensions[YGDimension.Width], layout.measuredDimensions[YGDimension.Height], reason);
        }
        layout.lastOwnerDirection = ownerDirection;
        if (cachedResults == null) {
            if (layout.nextCachedMeasurementsIndex + 1 > layoutMarkerData.maxMeasureCache) {
                layoutMarkerData.maxMeasureCache = layout.nextCachedMeasurementsIndex + 1;
            }
            if (layout.nextCachedMeasurementsIndex == YG_MAX_CACHED_RESULT_COUNT) {
                if (gPrintChanges) {
                    Log.log(node, YGLogLevel.Verbose, null, 'Out of cache entries!\n');
                }
                layout.nextCachedMeasurementsIndex = 0;
            }
            let newCacheEntry;
            if (performLayout) {
                // Use the single layout cache entry.
                newCacheEntry = layout.cachedLayout;
            }
            else {
                // Allocate a new measurement cache entry.
                newCacheEntry = layout.cachedMeasurements[layout.nextCachedMeasurementsIndex];
                layout.nextCachedMeasurementsIndex++;
            }
            newCacheEntry.availableWidth = availableWidth;
            newCacheEntry.availableHeight = availableHeight;
            newCacheEntry.widthMeasureMode = widthMeasureMode;
            newCacheEntry.heightMeasureMode = heightMeasureMode;
            newCacheEntry.computedWidth = layout.measuredDimensions[YGDimension.Width];
            newCacheEntry.computedHeight = layout.measuredDimensions[YGDimension.Height];
        }
    }
    if (performLayout) {
        node.setLayoutDimension(node.getLayout().measuredDimensions[YGDimension.Width], YGDimension.Width);
        node.setLayoutDimension(node.getLayout().measuredDimensions[YGDimension.Height], YGDimension.Height);
        node.setHasNewLayout(true);
        node.setDirty(false);
    }
    layout.generationCount = generationCount;
    let layoutType;
    if (performLayout) {
        layoutType =
            !needToVisitNode && cachedResults == layout.cachedLayout ? LayoutType.kCachedLayout : LayoutType.kLayout;
    }
    else {
        layoutType = cachedResults != null ? LayoutType.kCachedMeasure : LayoutType.kMeasure;
    }
    YGEvent.publish(node, EventType.NodeLayout, { layoutType, layoutContext });
    return needToVisitNode || cachedResults == null;
}
export function YGConfigSetPointScaleFactor(config, pixelsInPoint) {
    YGAssertWithConfig(config, pixelsInPoint >= 0.0, 'Scale factor should not be less than zero');
    if (pixelsInPoint == 0.0) {
        config.pointScaleFactor = 0.0;
    }
    else {
        config.pointScaleFactor = pixelsInPoint;
    }
}
function fmodf(x, y) {
    return x % y;
}
export function YGRoundToPixelGrid(node, pointScaleFactor, absoluteLeft, absoluteTop) {
    if (pointScaleFactor == 0.0) {
        return;
    }
    const nodeLeft = node.getLayout().position[YGEdge.Left];
    const nodeTop = node.getLayout().position[YGEdge.Top];
    const nodeWidth = node.getLayout().dimensions[YGDimension.Width];
    const nodeHeight = node.getLayout().dimensions[YGDimension.Height];
    const absoluteNodeLeft = absoluteLeft + nodeLeft;
    const absoluteNodeTop = absoluteTop + nodeTop;
    const absoluteNodeRight = absoluteNodeLeft + nodeWidth;
    const absoluteNodeBottom = absoluteNodeTop + nodeHeight;
    const textRounding = node.getNodeType() == YGNodeType.Text;
    node.setLayoutPosition(YGRoundValueToPixelGrid(nodeLeft, pointScaleFactor, false, textRounding), YGEdge.Left);
    node.setLayoutPosition(YGRoundValueToPixelGrid(nodeTop, pointScaleFactor, false, textRounding), YGEdge.Top);
    const hasFractionalWidth = !YGFloatsEqual(fmodf(nodeWidth * pointScaleFactor, 1.0), 0) &&
        !YGFloatsEqual(fmodf(nodeWidth * pointScaleFactor, 1.0), 1.0);
    const hasFractionalHeight = !YGFloatsEqual(fmodf(nodeHeight * pointScaleFactor, 1.0), 0) &&
        !YGFloatsEqual(fmodf(nodeHeight * pointScaleFactor, 1.0), 1.0);
    node.setLayoutDimension(YGRoundValueToPixelGrid(absoluteNodeRight, pointScaleFactor, textRounding && hasFractionalWidth, textRounding && !hasFractionalWidth) - YGRoundValueToPixelGrid(absoluteNodeLeft, pointScaleFactor, false, textRounding), YGDimension.Width);
    node.setLayoutDimension(YGRoundValueToPixelGrid(absoluteNodeBottom, pointScaleFactor, textRounding && hasFractionalHeight, textRounding && !hasFractionalHeight) - YGRoundValueToPixelGrid(absoluteNodeTop, pointScaleFactor, false, textRounding), YGDimension.Height);
    const childCount = YGNodeGetChildCount(node);
    for (let i = 0; i < childCount; i++) {
        YGRoundToPixelGrid(YGNodeGetChild(node, i), pointScaleFactor, absoluteNodeLeft, absoluteNodeTop);
    }
}
function unsetUseLegacyFlagRecursively(node) {
    node.getConfig().useLegacyStretchBehaviour = false;
    for (const child of node.getChildren()) {
        unsetUseLegacyFlagRecursively(child);
    }
}
export function YGNodeCalculateLayoutWithContext(node, ownerWidth, ownerHeight, ownerDirection, layoutContext) {
    YGEvent.publish(node, EventType.LayoutPassStart, { layoutContext });
    const markerData = new LayoutData();
    // Increment the generation count. This will force the recursive routine to
    // visit all dirty nodes at least once. Subsequent visits will be skipped if
    // the input parameters don't change.
    gCurrentGenerationCount++;
    node.resolveDimension();
    let width = YGUndefined;
    let widthMeasureMode = YGMeasureMode.Undefined;
    const maxDimensions = node.getStyle().maxDimensions;
    if (YGNodeIsStyleDimDefined(node, YGFlexDirection.Row, ownerWidth)) {
        width = YGResolveValue(node.getResolvedDimension(dim[YGFlexDirection.Row]), ownerWidth)
            .add(node.getMarginForAxis(YGFlexDirection.Row, ownerWidth))
            .unwrap();
        widthMeasureMode = YGMeasureMode.Exactly;
    }
    else if (!YGResolveValue(maxDimensions[YGDimension.Width], ownerWidth).isUndefined()) {
        width = YGResolveValue(maxDimensions[YGDimension.Width], ownerWidth).unwrap();
        widthMeasureMode = YGMeasureMode.AtMost;
    }
    else {
        width = ownerWidth;
        widthMeasureMode = YGFloatIsUndefined(width) ? YGMeasureMode.Undefined : YGMeasureMode.Exactly;
    }
    let height = YGUndefined;
    let heightMeasureMode = YGMeasureMode.Undefined;
    if (YGNodeIsStyleDimDefined(node, YGFlexDirection.Column, ownerHeight)) {
        height = YGResolveValue(node.getResolvedDimension(dim[YGFlexDirection.Column]), ownerHeight)
            .add(node.getMarginForAxis(YGFlexDirection.Column, ownerWidth))
            .unwrap();
        heightMeasureMode = YGMeasureMode.Exactly;
    }
    else if (!YGResolveValue(maxDimensions[YGDimension.Height], ownerHeight).isUndefined()) {
        height = YGResolveValue(maxDimensions[YGDimension.Height], ownerHeight).unwrap();
        heightMeasureMode = YGMeasureMode.AtMost;
    }
    else {
        height = ownerHeight;
        heightMeasureMode = YGFloatIsUndefined(height) ? YGMeasureMode.Undefined : YGMeasureMode.Exactly;
    }
    if (YGLayoutNodeInternal(node, width, height, ownerDirection, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, true, LayoutPassReason.kInitial, node.getConfig(), markerData, layoutContext, 0, // tree root
    gCurrentGenerationCount)) {
        node.setPosition(node.getLayout().direction, ownerWidth, ownerHeight, ownerWidth);
        YGRoundToPixelGrid(node, node.getConfig().pointScaleFactor, 0.0, 0.0);
    }
    YGEvent.publish(node, EventType.LayoutPassEnd, { layoutContext, layoutData: markerData });
    // We want to get rid off `useLegacyStretchBehaviour` from YGConfig. But we
    // aren't sure whether client's of yoga have gotten rid off this flag or not.
    // So logging this in YGLayout would help to find out the call sites depending
    // on this flag. This check would be removed once we are sure no one is
    // dependent on this flag anymore. The flag
    // `shouldDiffLayoutWithoutLegacyStretchBehaviour` in YGConfig will help to
    // run experiments.
    if (node.getConfig().shouldDiffLayoutWithoutLegacyStretchBehaviour && node.didUseLegacyFlag()) {
        const nodeWithoutLegacyFlag = YGNodeDeepClone(node);
        nodeWithoutLegacyFlag.resolveDimension();
        // Recursively mark nodes as dirty
        nodeWithoutLegacyFlag.markDirtyAndPropogateDownwards();
        gCurrentGenerationCount++;
        // Rerun the layout, and calculate the diff
        unsetUseLegacyFlagRecursively(nodeWithoutLegacyFlag);
        const layoutMarkerData = new LayoutData();
        if (YGLayoutNodeInternal(nodeWithoutLegacyFlag, width, height, ownerDirection, widthMeasureMode, heightMeasureMode, ownerWidth, ownerHeight, true, LayoutPassReason.kInitial, nodeWithoutLegacyFlag.getConfig(), layoutMarkerData, layoutContext, 0, // tree root
        gCurrentGenerationCount)) {
            nodeWithoutLegacyFlag.setPosition(nodeWithoutLegacyFlag.getLayout().direction, ownerWidth, ownerHeight, ownerWidth);
            YGRoundToPixelGrid(nodeWithoutLegacyFlag, nodeWithoutLegacyFlag.getConfig().pointScaleFactor, 0.0, 0.0);
            // Set whether the two layouts are different or not.
            const neededLegacyStretchBehaviour = !nodeWithoutLegacyFlag.isLayoutTreeEqualToNode(node);
            node.setLayoutDoesLegacyFlagAffectsLayout(neededLegacyStretchBehaviour);
        }
        YGConfigFreeRecursive(nodeWithoutLegacyFlag);
        YGNodeFreeRecursive(nodeWithoutLegacyFlag);
    }
}
export function YGNodeCalculateLayout(node, ownerWidth, ownerHeight, ownerDirection) {
    YGNodeCalculateLayoutWithContext(node, ownerWidth, ownerHeight, ownerDirection, null);
}
export function YGConfigSetLogger(config, logger) {
    if (logger != null) {
        config.logger = logger;
    }
    else {
        config.logger = YGDefaultLog;
    }
}
export function YGConfigSetShouldDiffLayoutWithoutLegacyStretchBehaviour(config, shouldDiffLayout) {
    config.shouldDiffLayoutWithoutLegacyStretchBehaviour = shouldDiffLayout;
}
export function YGAssert(condition, message) {
    if (!condition) {
        Log.log(new YGNode(null), YGLogLevel.Fatal, null, '%s\n', message);
        throwLogicalErrorWithMessage(message);
    }
}
export function YGAssertWithNode(node, condition, message) {
    if (!condition) {
        Log.log(node, YGLogLevel.Fatal, null, '%s\n', message);
        throwLogicalErrorWithMessage(message);
    }
}
export function YGAssertWithConfig(config, condition, message) {
    if (!condition) {
        Log.log(config, YGLogLevel.Fatal, null, '%s\n', message);
        throwLogicalErrorWithMessage(message);
    }
}
export function YGConfigSetExperimentalFeatureEnabled(config, feature, enabled) {
    config.experimentalFeatures[feature] = enabled;
}
export function YGConfigIsExperimentalFeatureEnabled(config, feature) {
    return config.experimentalFeatures[feature];
}
export function YGConfigSetUseWebDefaults(config, enabled) {
    config.useWebDefaults = enabled;
}
export function YGConfigSetUseLegacyStretchBehaviour(config, useLegacyStretchBehaviour) {
    config.useLegacyStretchBehaviour = useLegacyStretchBehaviour;
}
export function YGConfigGetUseWebDefaults(config) {
    return config.useWebDefaults;
}
export function YGConfigSetContext(config, context) {
    config.context = context;
}
export function YGConfigGetContext(config) {
    return config.context;
}
export function YGConfigSetCloneNodeFunc(config, callback) {
    config.cloneNodeCallback = callback;
}
export function YGTraverseChildrenPreOrder(children, f) {
    for (let i = 0; i < children.length; ++i) {
        const node = children[i];
        f(node);
        YGTraverseChildrenPreOrder(node.getChildren(), f);
    }
}
export function YGTraversePreOrder(node, f) {
    if (!node) {
        return;
    }
    f(node);
    YGTraverseChildrenPreOrder(node.getChildren(), f);
}
//# sourceMappingURL=yoga.js.map