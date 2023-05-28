// upstream: https://github.com/facebook/yoga/blob/v1.19.0/javascript/sources/entry-common.js
import { YGAlign, YGDimension, YGDirection, YGDisplay, YGEdge, YGExperimentalFeature, YGFlexDirection, YGJustify, YGLogLevel, YGMeasureMode, YGNodeType, YGOverflow, YGPositionType, YGUnit, YGWrap, } from './enums.js';
import { YGNodeCalculateLayout, YGNodeCopyStyle, YGNodeFree, YGNodeFreeRecursive, YGNodeStyleGetAlignContent, YGNodeStyleGetAlignItems, YGNodeStyleGetAlignSelf, YGNodeStyleGetAspectRatio, YGNodeStyleGetBorder, YGNodeGetChild, YGNodeGetChildCount, YGNodeLayoutGetBorder, YGNodeLayoutGetBottom, YGNodeLayoutGetHeight, YGNodeLayoutGetLeft, YGNodeLayoutGetRight, YGNodeLayoutGetTop, YGNodeLayoutGetWidth, YGNodeLayoutGetMargin, YGNodeLayoutGetPadding, YGNodeStyleGetDisplay, YGNodeStyleGetFlexBasis, YGNodeStyleGetFlexDirection, YGNodeStyleGetFlexGrow, YGNodeStyleGetFlexShrink, YGNodeStyleGetFlexWrap, YGNodeStyleGetHeight, YGNodeStyleGetJustifyContent, YGNodeStyleGetMargin, YGNodeStyleGetMaxHeight, YGNodeStyleGetMaxWidth, YGNodeStyleGetMinHeight, YGNodeStyleGetMinWidth, YGNodeStyleGetOverflow, YGNodeStyleGetPadding, YGNodeGetParent, YGNodeStyleGetPositionType, YGNodeStyleGetWidth, YGNodeInsertChild, YGNodeIsDirty, YGNodeMarkDirty, YGNodeRemoveChild, YGNodeReset, YGNodeStyleSetAlignContent, YGNodeStyleSetAlignItems, YGNodeStyleSetAlignSelf, YGNodeStyleSetAspectRatio, YGNodeStyleSetBorder, YGNodeStyleSetDisplay, YGNodeStyleSetFlex, YGNodeStyleSetFlexBasis, YGNodeStyleSetFlexBasisPercent, YGNodeStyleSetFlexDirection, YGNodeStyleSetFlexGrow, YGNodeStyleSetFlexShrink, YGNodeStyleSetFlexWrap, YGNodeStyleSetHeight, YGNodeStyleSetHeightAuto, YGNodeStyleSetHeightPercent, YGNodeStyleSetJustifyContent, YGNodeStyleSetMargin, YGNodeStyleSetMarginAuto, YGNodeStyleSetMarginPercent, YGNodeStyleSetMaxHeight, YGNodeStyleSetMaxHeightPercent, YGNodeStyleSetMaxWidth, YGNodeStyleSetMaxWidthPercent, YGNodeSetMeasureFunc, YGNodeStyleSetMinHeight, YGNodeStyleSetMinHeightPercent, YGNodeStyleSetMinWidth, YGNodeStyleSetMinWidthPercent, YGNodeStyleSetOverflow, YGNodeStyleSetPadding, YGNodeStyleSetPaddingPercent, YGNodeStyleSetPositionType, YGNodeStyleSetPositionPercent, YGNodeStyleSetWidth, YGNodeStyleSetWidthAuto, YGNodeStyleSetWidthPercent, YGNodeGetContext, YGNodeSetContext, YGConfigFree, YGConfigSetExperimentalFeatureEnabled, YGConfigSetPointScaleFactor, YGConfigIsExperimentalFeatureEnabled, YGNodeStyleGetPosition, YGConfigNew, YGNodeNewWithConfig, YGNodeNew, YGNodeStyleSetPosition, YGNodeSetIsReferenceBaseline, YGNodeIsReferenceBaseline, YGNodeSetDirtiedFunc, YGNodeGetDirtiedFunc, } from './yoga.js';
import { YGFloatSanitize } from './utils.js';
export const ALIGN_AUTO = YGAlign.Auto;
export const ALIGN_FLEX_START = YGAlign.FlexStart;
export const ALIGN_CENTER = YGAlign.Center;
export const ALIGN_FLEX_END = YGAlign.FlexEnd;
export const ALIGN_STRETCH = YGAlign.Stretch;
export const ALIGN_BASELINE = YGAlign.Baseline;
export const ALIGN_SPACE_BETWEEN = YGAlign.SpaceBetween;
export const ALIGN_SPACE_AROUND = YGAlign.SpaceAround;
export const DIMENSION_WIDTH = YGDimension.Width;
export const DIMENSION_HEIGHT = YGDimension.Height;
export const DIRECTION_INHERIT = YGDirection.Inherit;
export const DIRECTION_LTR = YGDirection.LTR;
export const DIRECTION_RTL = YGDirection.RTL;
export const DISPLAY_FLEX = YGDisplay.Flex;
export const DISPLAY_NONE = YGDisplay.None;
export const EDGE_LEFT = YGEdge.Left;
export const EDGE_TOP = YGEdge.Top;
export const EDGE_RIGHT = YGEdge.Right;
export const EDGE_BOTTOM = YGEdge.Bottom;
export const EDGE_START = YGEdge.Start;
export const EDGE_END = YGEdge.End;
export const EDGE_HORIZONTAL = YGEdge.Horizontal;
export const EDGE_VERTICAL = YGEdge.Vertical;
export const EDGE_ALL = YGEdge.All;
export const EXPERIMENTALFEATURE_WEBFLEXBASIS = YGExperimentalFeature.WebFlexBasis;
export const FLEX_DIRECTION_COLUMN = YGFlexDirection.Column;
export const FLEX_DIRECTION_COLUMN_REVERSE = YGFlexDirection.ColumnReverse;
export const FLEX_DIRECTION_ROW = YGFlexDirection.Row;
export const FLEX_DIRECTION_ROW_REVERSE = YGFlexDirection.RowReverse;
export const JUSTIFY_FLEX_START = YGJustify.FlexStart;
export const JUSTIFY_CENTER = YGJustify.Center;
export const JUSTIFY_FLEX_END = YGJustify.FlexEnd;
export const JUSTIFY_SPACE_BETWEEN = YGJustify.SpaceBetween;
export const JUSTIFY_SPACE_AROUND = YGJustify.SpaceAround;
export const JUSTIFY_SPACE_EVENLY = YGJustify.SpaceEvenly;
export const LOGLEVEL_ERROR = YGLogLevel.Error;
export const LOGLEVEL_WARN = YGLogLevel.Warn;
export const LOGLEVEL_INFO = YGLogLevel.Info;
export const LOGLEVEL_DEBUG = YGLogLevel.Debug;
export const LOGLEVEL_VERBOSE = YGLogLevel.Verbose;
export const LOGLEVEL_FATAL = YGLogLevel.Fatal;
export const MEASURE_MODE_UNDEFINED = YGMeasureMode.Undefined;
export const MEASURE_MODE_EXACTLY = YGMeasureMode.Exactly;
export const MEASURE_MODE_AT_MOST = YGMeasureMode.AtMost;
export const NODE_TYPE_DEFAULT = YGNodeType.Default;
export const NODE_TYPE_TEXT = YGNodeType.Text;
export const OVERFLOW_VISIBLE = YGOverflow.Visible;
export const OVERFLOW_HIDDEN = YGOverflow.Hidden;
export const OVERFLOW_SCROLL = YGOverflow.Scroll;
export const POSITION_TYPE_RELATIVE = YGPositionType.Relative;
export const POSITION_TYPE_ABSOLUTE = YGPositionType.Absolute;
export const UNIT_UNDEFINED = YGUnit.Undefined;
export const UNIT_POINT = YGUnit.Point;
export const UNIT_PERCENT = YGUnit.Percent;
export const UNIT_AUTO = YGUnit.Auto;
export const WRAP_NO_WRAP = YGWrap.NoWrap;
export const WRAP_WRAP = YGWrap.Wrap;
export const WRAP_WRAP_REVERSE = YGWrap.WrapReverse;
export const UNDEFINED = undefined;
export class Layout {
    left;
    right;
    bottom;
    top;
    width;
    height;
}
export class Size {
    width;
    height;
    constructor(width, height) {
        if (width) {
            this.width = width;
            this.height = height;
        }
        else {
            this.width = 0;
            this.height = 0;
        }
    }
    static fromJS(obj) {
        return new Size(obj.width, obj.height);
    }
}
export class Value {
    unit;
    value;
    constructor(unit, value) {
        if (unit) {
            this.unit = unit;
            this.value = value;
        }
        else {
            this.unit = YGUnit.Undefined;
            this.value = 0;
        }
    }
}
export class Config {
    config;
    static create() {
        return new Config();
    }
    constructor() {
        this.config = YGConfigNew();
    }
    free() {
        YGConfigFree(this.config);
    }
    setExperimentalFeatureEnabled(feature, enabled) {
        YGConfigSetExperimentalFeatureEnabled(this.config, feature, enabled);
    }
    setPointScaleFactor(pixelsInPoint) {
        YGConfigSetPointScaleFactor(this.config, pixelsInPoint);
    }
    isExperimentalFeatureEnabled(feature) {
        return YGConfigIsExperimentalFeatureEnabled(this.config, feature);
    }
}
function fromYGNode(node) {
    return YGNodeGetContext(node);
}
function fromYGValue(val) {
    return new Value(val.unit, val.value);
}
export class Node {
    node;
    static create(config) {
        if (config) {
            return new Node(config);
        }
        else {
            return new Node();
        }
    }
    static createDefault() {
        return new Node(undefined);
    }
    static createWithConfig(config) {
        return new Node(config);
    }
    constructor(config) {
        if (!config) {
            this.node = YGNodeNew();
        }
        else {
            this.node = YGNodeNewWithConfig(config.config);
        }
        YGNodeSetContext(this.node, this);
    }
    calculateLayout(width, height, direction) {
        YGNodeCalculateLayout(this.node, width, height, direction);
    }
    copyStyle(node) {
        YGNodeCopyStyle(this.node, node);
    }
    free() {
        YGNodeFree(this.node);
    }
    freeRecursive() {
        YGNodeFreeRecursive(this.node);
    }
    getAlignContent() {
        return YGNodeStyleGetAlignContent(this.node);
    }
    getAlignItems() {
        return YGNodeStyleGetAlignItems(this.node);
    }
    getAlignSelf() {
        return YGNodeStyleGetAlignSelf(this.node);
    }
    getAspectRatio() {
        return YGNodeStyleGetAspectRatio(this.node);
    }
    getBorder(edge) {
        return YGNodeStyleGetBorder(this.node, edge);
    }
    getChild(index) {
        return fromYGNode(YGNodeGetChild(this.node, index));
    }
    getChildCount() {
        return YGNodeGetChildCount(this.node);
    }
    getComputedBorder(edge) {
        return YGNodeLayoutGetBorder(this.node, edge);
    }
    getComputedBottom() {
        return YGNodeLayoutGetBottom(this.node);
    }
    getComputedHeight() {
        return YGFloatSanitize(YGNodeLayoutGetHeight(this.node));
    }
    getComputedLayout() {
        const layout = new Layout();
        layout.left = YGNodeLayoutGetLeft(this.node);
        layout.right = YGNodeLayoutGetRight(this.node);
        layout.top = YGNodeLayoutGetTop(this.node);
        layout.bottom = YGNodeLayoutGetBottom(this.node);
        layout.width = YGNodeLayoutGetWidth(this.node);
        layout.height = YGNodeLayoutGetHeight(this.node);
        return layout;
    }
    getComputedLeft() {
        return YGFloatSanitize(YGNodeLayoutGetLeft(this.node));
    }
    getComputedMargin(edge) {
        return YGFloatSanitize(YGNodeLayoutGetMargin(this.node, edge));
    }
    getComputedPadding(edge) {
        return YGFloatSanitize(YGNodeLayoutGetPadding(this.node, edge));
    }
    getComputedRight() {
        return YGFloatSanitize(YGNodeLayoutGetRight(this.node));
    }
    getComputedTop() {
        return YGFloatSanitize(YGNodeLayoutGetTop(this.node));
    }
    getComputedWidth() {
        return YGFloatSanitize(YGNodeLayoutGetWidth(this.node));
    }
    getDisplay() {
        return YGNodeStyleGetDisplay(this.node);
    }
    getFlexBasis() {
        return fromYGValue(YGNodeStyleGetFlexBasis(this.node));
    }
    getFlexDirection() {
        return YGNodeStyleGetFlexDirection(this.node);
    }
    getFlexGrow() {
        return YGNodeStyleGetFlexGrow(this.node);
    }
    getFlexShrink() {
        return YGNodeStyleGetFlexShrink(this.node);
    }
    getFlexWrap() {
        return YGNodeStyleGetFlexWrap(this.node);
    }
    getHeight() {
        return fromYGValue(YGNodeStyleGetHeight(this.node));
    }
    getJustifyContent() {
        return YGNodeStyleGetJustifyContent(this.node);
    }
    getMargin(edge) {
        return fromYGValue(YGNodeStyleGetMargin(this.node, edge));
    }
    getMaxHeight() {
        return fromYGValue(YGNodeStyleGetMaxHeight(this.node));
    }
    getMaxWidth() {
        return fromYGValue(YGNodeStyleGetMaxWidth(this.node));
    }
    getMinHeight() {
        return fromYGValue(YGNodeStyleGetMinHeight(this.node));
    }
    getMinWidth() {
        return fromYGValue(YGNodeStyleGetMinWidth(this.node));
    }
    getOverflow() {
        return YGNodeStyleGetOverflow(this.node);
    }
    getPadding(edge) {
        return fromYGValue(YGNodeStyleGetPadding(this.node, edge));
    }
    getParent() {
        const parent = YGNodeGetParent(this.node);
        if (!parent) {
            return undefined;
        }
        return fromYGNode(parent);
    }
    getPosition(edge) {
        return fromYGValue(YGNodeStyleGetPosition(this.node, edge));
    }
    getPositionType() {
        return YGNodeStyleGetPositionType(this.node);
    }
    getWidth() {
        return fromYGValue(YGNodeStyleGetWidth(this.node));
    }
    getDirtied() {
        return YGNodeGetDirtiedFunc(this.node);
    }
    insertChild(child, index) {
        YGNodeInsertChild(this.node, child.node, index);
    }
    isDirty() {
        return YGNodeIsDirty(this.node);
    }
    markDirty() {
        YGNodeMarkDirty(this.node);
    }
    removeChild(child) {
        YGNodeRemoveChild(this.node, child.node);
    }
    reset() {
        // m_measureFunc.reset(nullptr);
        YGNodeReset(this.node);
    }
    setAlignContent(alignContent) {
        YGNodeStyleSetAlignContent(this.node, alignContent);
    }
    setAlignItems(alignItems) {
        YGNodeStyleSetAlignItems(this.node, alignItems);
    }
    setAlignSelf(alignSelf) {
        YGNodeStyleSetAlignSelf(this.node, alignSelf);
    }
    setAspectRatio(aspectRatio) {
        YGNodeStyleSetAspectRatio(this.node, aspectRatio);
    }
    setBorder(edge, borderWidth) {
        YGNodeStyleSetBorder(this.node, edge, borderWidth);
    }
    setDisplay(display) {
        YGNodeStyleSetDisplay(this.node, display);
    }
    setFlex(flex) {
        YGNodeStyleSetFlex(this.node, flex);
    }
    setFlexBasis(flexBasis) {
        if (typeof flexBasis === 'string') {
            if (flexBasis[flexBasis.length - 1] === '%') {
                this.setFlexBasisPercent(parseFloat(flexBasis));
            }
            else {
                throw new Error('Invalid input type');
            }
        }
        else {
            YGNodeStyleSetFlexBasis(this.node, flexBasis);
        }
    }
    setFlexBasisPercent(flexBasis) {
        YGNodeStyleSetFlexBasisPercent(this.node, flexBasis);
    }
    setFlexDirection(flexDirection) {
        YGNodeStyleSetFlexDirection(this.node, flexDirection);
    }
    setFlexGrow(flexGrow) {
        YGNodeStyleSetFlexGrow(this.node, flexGrow);
    }
    setFlexShrink(flexShrink) {
        YGNodeStyleSetFlexShrink(this.node, flexShrink);
    }
    setFlexWrap(flexWrap) {
        YGNodeStyleSetFlexWrap(this.node, flexWrap);
    }
    setHeight(height) {
        if (typeof height === 'string') {
            if (height === 'auto') {
                this.setHeightAuto();
            }
            else if (height[height.length - 1] === '%') {
                this.setHeightPercent(parseFloat(height));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetHeight(this.node, height);
        }
    }
    setHeightAuto() {
        YGNodeStyleSetHeightAuto(this.node);
    }
    setHeightPercent(height) {
        YGNodeStyleSetHeightPercent(this.node, height);
    }
    setJustifyContent(justifyContent) {
        YGNodeStyleSetJustifyContent(this.node, justifyContent);
    }
    setMargin(edge, margin) {
        if (typeof margin === 'string') {
            if (margin === 'auto') {
                this.setMarginAuto(edge);
            }
            else if (margin[margin.length - 1] === '%') {
                this.setMarginPercent(edge, parseFloat(margin));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetMargin(this.node, edge, margin);
        }
    }
    setMarginAuto(edge) {
        YGNodeStyleSetMarginAuto(this.node, edge);
    }
    setMarginPercent(edge, margin) {
        YGNodeStyleSetMarginPercent(this.node, edge, margin);
    }
    setMaxHeight(maxHeight) {
        if (typeof maxHeight === 'string') {
            if (maxHeight[maxHeight.length - 1] === '%') {
                this.setMaxHeightPercent(parseFloat(maxHeight));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetMaxHeight(this.node, maxHeight);
        }
    }
    setMaxHeightPercent(maxHeight) {
        YGNodeStyleSetMaxHeightPercent(this.node, maxHeight);
    }
    setMaxWidth(maxWidth) {
        if (typeof maxWidth === 'string') {
            if (maxWidth[maxWidth.length - 1] === '%') {
                this.setMaxWidthPercent(parseFloat(maxWidth));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetMaxWidth(this.node, maxWidth);
        }
    }
    setMaxWidthPercent(maxWidth) {
        YGNodeStyleSetMaxWidthPercent(this.node, maxWidth);
    }
    setMeasureFunc(measureFunc) {
        if (measureFunc == null) {
            this.unsetMeasureFunc();
        }
        else {
            YGNodeSetMeasureFunc(this.node, measureFunc);
        }
    }
    unsetMeasureFunc() {
        YGNodeSetMeasureFunc(this.node, null);
    }
    setMinHeight(minHeight) {
        if (typeof minHeight === 'string') {
            if (minHeight[minHeight.length - 1] === '%') {
                this.setMinHeightPercent(parseFloat(minHeight));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetMinHeight(this.node, minHeight);
        }
    }
    setMinHeightPercent(minHeight) {
        YGNodeStyleSetMinHeightPercent(this.node, minHeight);
    }
    setMinWidth(minWidth) {
        if (typeof minWidth === 'string') {
            if (minWidth[minWidth.length - 1] === '%') {
                this.setMinWidthPercent(parseFloat(minWidth));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetMinWidth(this.node, minWidth);
        }
    }
    setMinWidthPercent(minWidth) {
        YGNodeStyleSetMinWidthPercent(this.node, minWidth);
    }
    setOverflow(overflow) {
        YGNodeStyleSetOverflow(this.node, overflow);
    }
    setPadding(edge, padding) {
        if (typeof padding === 'string') {
            if (padding[padding.length - 1] === '%') {
                this.setPaddingPercent(edge, parseFloat(padding));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetPadding(this.node, edge, padding);
        }
    }
    setPaddingPercent(edge, padding) {
        YGNodeStyleSetPaddingPercent(this.node, edge, padding);
    }
    setPosition(edge, position) {
        if (typeof position === 'string') {
            if (position[position.length - 1] === '%') {
                this.setPositionPercent(edge, parseFloat(position));
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetPosition(this.node, edge, position);
        }
    }
    setPositionPercent(edge, position) {
        YGNodeStyleSetPositionPercent(this.node, edge, position);
    }
    setPositionType(positionType) {
        YGNodeStyleSetPositionType(this.node, positionType);
    }
    setWidth(width) {
        if (typeof width === 'string') {
            if (width[width.length - 1] === '%') {
                this.setWidthPercent(parseFloat(width));
            }
            else if (width === 'auto') {
                this.setWidthAuto();
            }
            else {
                throw new Error('Invalid input type.');
            }
        }
        else {
            YGNodeStyleSetWidth(this.node, width);
        }
    }
    setWidthAuto() {
        YGNodeStyleSetWidthAuto(this.node);
    }
    setWidthPercent(width) {
        YGNodeStyleSetWidthPercent(this.node, width);
    }
    setDirtiedFunc(dirtiedFunc) {
        return YGNodeSetDirtiedFunc(this.node, dirtiedFunc);
    }
    unsetMeasureFun() {
        YGNodeSetMeasureFunc(this.node, undefined);
    }
    isReferenceBaseline() {
        return YGNodeIsReferenceBaseline(this.node);
    }
    setIsReferenceBaseline(isReferenceBaseline) {
        YGNodeSetIsReferenceBaseline(this.node, isReferenceBaseline);
    }
}
//# sourceMappingURL=api.js.map