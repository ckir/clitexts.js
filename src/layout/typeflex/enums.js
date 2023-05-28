// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGEnums.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGEnums.cpp
export const YGAlignCount = 8;
export var YGAlign;
(function (YGAlign) {
    YGAlign[YGAlign["Auto"] = 0] = "Auto";
    YGAlign[YGAlign["FlexStart"] = 1] = "FlexStart";
    YGAlign[YGAlign["Center"] = 2] = "Center";
    YGAlign[YGAlign["FlexEnd"] = 3] = "FlexEnd";
    YGAlign[YGAlign["Stretch"] = 4] = "Stretch";
    YGAlign[YGAlign["Baseline"] = 5] = "Baseline";
    YGAlign[YGAlign["SpaceBetween"] = 6] = "SpaceBetween";
    YGAlign[YGAlign["SpaceAround"] = 7] = "SpaceAround";
})(YGAlign || (YGAlign = {}));
export function YGAlignToString(value) {
    switch (value) {
        case YGAlign.Auto:
            return 'auto';
        case YGAlign.FlexStart:
            return 'flex-start';
        case YGAlign.Center:
            return 'center';
        case YGAlign.FlexEnd:
            return 'flex-end';
        case YGAlign.Stretch:
            return 'stretch';
        case YGAlign.Baseline:
            return 'baseline';
        case YGAlign.SpaceBetween:
            return 'space-between';
        case YGAlign.SpaceAround:
            return 'space-around';
    }
    return 'unknown';
}
export const YGDimensionCount = 2;
export var YGDimension;
(function (YGDimension) {
    YGDimension[YGDimension["Width"] = 0] = "Width";
    YGDimension[YGDimension["Height"] = 1] = "Height";
})(YGDimension || (YGDimension = {}));
export function YGDimensionToString(value) {
    switch (value) {
        case YGDimension.Width:
            return 'width';
        case YGDimension.Height:
            return 'height';
    }
    return 'unknown';
}
export var YGDirection;
(function (YGDirection) {
    YGDirection[YGDirection["Inherit"] = 0] = "Inherit";
    YGDirection[YGDirection["LTR"] = 1] = "LTR";
    YGDirection[YGDirection["RTL"] = 2] = "RTL";
})(YGDirection || (YGDirection = {}));
export function YGDirectionToString(value) {
    switch (value) {
        case YGDirection.Inherit:
            return 'inherit';
        case YGDirection.LTR:
            return 'ltr';
        case YGDirection.RTL:
            return 'rtl';
    }
    return 'unknown';
}
export const YGDisplayCount = 2;
export var YGDisplay;
(function (YGDisplay) {
    YGDisplay[YGDisplay["Flex"] = 0] = "Flex";
    YGDisplay[YGDisplay["None"] = 1] = "None";
})(YGDisplay || (YGDisplay = {}));
export function YGDisplayToString(value) {
    switch (value) {
        case YGDisplay.Flex:
            return 'flex';
        case YGDisplay.None:
            return 'none';
    }
    return 'unknown';
}
export const YGEdgeCount = 9;
export var YGEdge;
(function (YGEdge) {
    YGEdge[YGEdge["Left"] = 0] = "Left";
    YGEdge[YGEdge["Top"] = 1] = "Top";
    YGEdge[YGEdge["Right"] = 2] = "Right";
    YGEdge[YGEdge["Bottom"] = 3] = "Bottom";
    YGEdge[YGEdge["Start"] = 4] = "Start";
    YGEdge[YGEdge["End"] = 5] = "End";
    YGEdge[YGEdge["Horizontal"] = 6] = "Horizontal";
    YGEdge[YGEdge["Vertical"] = 7] = "Vertical";
    YGEdge[YGEdge["All"] = 8] = "All";
})(YGEdge || (YGEdge = {}));
export function YGEdgeToString(value) {
    switch (value) {
        case YGEdge.Left:
            return 'left';
        case YGEdge.Top:
            return 'top';
        case YGEdge.Right:
            return 'right';
        case YGEdge.Bottom:
            return 'bottom';
        case YGEdge.Start:
            return 'start';
        case YGEdge.End:
            return 'end';
        case YGEdge.Horizontal:
            return 'horizontal';
        case YGEdge.Vertical:
            return 'vertical';
        case YGEdge.All:
            return 'all';
    }
    return 'unknown';
}
export const YGExperimentalFeatureCount = 1;
export var YGExperimentalFeature;
(function (YGExperimentalFeature) {
    YGExperimentalFeature[YGExperimentalFeature["WebFlexBasis"] = 0] = "WebFlexBasis";
})(YGExperimentalFeature || (YGExperimentalFeature = {}));
export function YGExperimentalFeatureToString(value) {
    switch (value) {
        case YGExperimentalFeature.WebFlexBasis:
            return 'web-flex-basis';
    }
    return 'unknown';
}
export const YGFlexDirectionCount = 4;
export var YGFlexDirection;
(function (YGFlexDirection) {
    YGFlexDirection[YGFlexDirection["Column"] = 0] = "Column";
    YGFlexDirection[YGFlexDirection["ColumnReverse"] = 1] = "ColumnReverse";
    YGFlexDirection[YGFlexDirection["Row"] = 2] = "Row";
    YGFlexDirection[YGFlexDirection["RowReverse"] = 3] = "RowReverse";
})(YGFlexDirection || (YGFlexDirection = {}));
export function YGFlexDirectionToString(value) {
    switch (value) {
        case YGFlexDirection.Column:
            return 'column';
        case YGFlexDirection.ColumnReverse:
            return 'column-reverse';
        case YGFlexDirection.Row:
            return 'row';
        case YGFlexDirection.RowReverse:
            return 'row-reverse';
    }
    return 'unknown';
}
export const YGJustifyCount = 6;
export var YGJustify;
(function (YGJustify) {
    YGJustify[YGJustify["FlexStart"] = 0] = "FlexStart";
    YGJustify[YGJustify["Center"] = 1] = "Center";
    YGJustify[YGJustify["FlexEnd"] = 2] = "FlexEnd";
    YGJustify[YGJustify["SpaceBetween"] = 3] = "SpaceBetween";
    YGJustify[YGJustify["SpaceAround"] = 4] = "SpaceAround";
    YGJustify[YGJustify["SpaceEvenly"] = 5] = "SpaceEvenly";
})(YGJustify || (YGJustify = {}));
export function YGJustifyToString(value) {
    switch (value) {
        case YGJustify.FlexStart:
            return 'flex-start';
        case YGJustify.Center:
            return 'center';
        case YGJustify.FlexEnd:
            return 'flex-end';
        case YGJustify.SpaceBetween:
            return 'space-between';
        case YGJustify.SpaceAround:
            return 'space-around';
        case YGJustify.SpaceEvenly:
            return 'space-evenly';
    }
    return 'unknown';
}
export const YGLogLevelCount = 6;
export var YGLogLevel;
(function (YGLogLevel) {
    YGLogLevel[YGLogLevel["Error"] = 0] = "Error";
    YGLogLevel[YGLogLevel["Warn"] = 1] = "Warn";
    YGLogLevel[YGLogLevel["Info"] = 2] = "Info";
    YGLogLevel[YGLogLevel["Debug"] = 3] = "Debug";
    YGLogLevel[YGLogLevel["Verbose"] = 4] = "Verbose";
    YGLogLevel[YGLogLevel["Fatal"] = 5] = "Fatal";
})(YGLogLevel || (YGLogLevel = {}));
export function YGLogLevelToString(value) {
    switch (value) {
        case YGLogLevel.Error:
            return 'error';
        case YGLogLevel.Warn:
            return 'warn';
        case YGLogLevel.Info:
            return 'info';
        case YGLogLevel.Debug:
            return 'debug';
        case YGLogLevel.Verbose:
            return 'verbose';
        case YGLogLevel.Fatal:
            return 'fatal';
    }
    return 'unknown';
}
export const YGMeasureModeCount = 3;
export var YGMeasureMode;
(function (YGMeasureMode) {
    YGMeasureMode[YGMeasureMode["Undefined"] = 0] = "Undefined";
    YGMeasureMode[YGMeasureMode["Exactly"] = 1] = "Exactly";
    YGMeasureMode[YGMeasureMode["AtMost"] = 2] = "AtMost";
})(YGMeasureMode || (YGMeasureMode = {}));
export function YGMeasureModeToString(value) {
    switch (value) {
        case YGMeasureMode.Undefined:
            return 'undefined';
        case YGMeasureMode.Exactly:
            return 'exactly';
        case YGMeasureMode.AtMost:
            return 'at-most';
    }
    return 'unknown';
}
export const YGNodeTypeCount = 2;
export var YGNodeType;
(function (YGNodeType) {
    YGNodeType[YGNodeType["Default"] = 0] = "Default";
    YGNodeType[YGNodeType["Text"] = 1] = "Text";
})(YGNodeType || (YGNodeType = {}));
export function YGNodeTypeToString(value) {
    switch (value) {
        case YGNodeType.Default:
            return 'default';
        case YGNodeType.Text:
            return 'text';
    }
    return 'unknown';
}
export const YGOverflowCount = 3;
export var YGOverflow;
(function (YGOverflow) {
    YGOverflow[YGOverflow["Visible"] = 0] = "Visible";
    YGOverflow[YGOverflow["Hidden"] = 1] = "Hidden";
    YGOverflow[YGOverflow["Scroll"] = 2] = "Scroll";
})(YGOverflow || (YGOverflow = {}));
export function YGOverflowToString(value) {
    switch (value) {
        case YGOverflow.Visible:
            return 'visible';
        case YGOverflow.Hidden:
            return 'hidden';
        case YGOverflow.Scroll:
            return 'scroll';
    }
    return 'unknown';
}
export const YGPositionTypeCount = 2;
export var YGPositionType;
(function (YGPositionType) {
    YGPositionType[YGPositionType["Static"] = 0] = "Static";
    YGPositionType[YGPositionType["Relative"] = 1] = "Relative";
    YGPositionType[YGPositionType["Absolute"] = 2] = "Absolute";
})(YGPositionType || (YGPositionType = {}));
export function YGPositionTypeToString(value) {
    switch (value) {
        case YGPositionType.Static:
            return 'static';
        case YGPositionType.Relative:
            return 'relative';
        case YGPositionType.Absolute:
            return 'absolute';
    }
    return 'unknown';
}
export const YGPrintOptionsCount = 3;
export var YGPrintOptions;
(function (YGPrintOptions) {
    YGPrintOptions[YGPrintOptions["Layout"] = 1] = "Layout";
    YGPrintOptions[YGPrintOptions["Style"] = 2] = "Style";
    YGPrintOptions[YGPrintOptions["Children"] = 4] = "Children";
})(YGPrintOptions || (YGPrintOptions = {}));
export function YGPrintOptionsToString(value) {
    switch (value) {
        case YGPrintOptions.Layout:
            return 'layout';
        case YGPrintOptions.Style:
            return 'style';
        case YGPrintOptions.Children:
            return 'children';
    }
    return 'unknown';
}
export const YGUnitCount = 4;
export var YGUnit;
(function (YGUnit) {
    YGUnit[YGUnit["Undefined"] = 0] = "Undefined";
    YGUnit[YGUnit["Point"] = 1] = "Point";
    YGUnit[YGUnit["Percent"] = 2] = "Percent";
    YGUnit[YGUnit["Auto"] = 3] = "Auto";
})(YGUnit || (YGUnit = {}));
export function YGUnitToString(value) {
    switch (value) {
        case YGUnit.Undefined:
            return 'undefined';
        case YGUnit.Point:
            return 'point';
        case YGUnit.Percent:
            return 'percent';
        case YGUnit.Auto:
            return 'auto';
    }
    return 'unknown';
}
export const YGWrapCount = 3;
export var YGWrap;
(function (YGWrap) {
    YGWrap[YGWrap["NoWrap"] = 0] = "NoWrap";
    YGWrap[YGWrap["Wrap"] = 1] = "Wrap";
    YGWrap[YGWrap["WrapReverse"] = 2] = "WrapReverse";
})(YGWrap || (YGWrap = {}));
export function YGWrapToString(value) {
    switch (value) {
        case YGWrap.NoWrap:
            return 'no-wrap';
        case YGWrap.Wrap:
            return 'wrap';
        case YGWrap.WrapReverse:
            return 'wrap-reverse';
    }
    return 'unknown';
}
//# sourceMappingURL=enums.js.map