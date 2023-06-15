import { YGEdge, YGNodeType, YGFlexDirection, YGAlign, YGMeasureMode, YGLogLevel, YGDirection, YGJustify, YGPositionType, YGWrap, YGOverflow, YGDisplay, YGDimension, YGPrintOptions, YGExperimentalFeature } from './enums.js';
import { YGNode } from './ygnode.js';
import { YGConfig } from './ygconfig.js';
import { YGFloatOptional } from './ygfloatoptional.js';
import { YGValue } from './ygvalue.js';
import { YGCollectFlexItemsRowValues } from './utils.js';
import { LayoutData, LayoutPassReason } from './event.js';
export declare class YGSize {
    width: number;
    height: number;
}
export interface YGPrintFunc {
    (node: YGNode, contextFn?: any): void;
}
export interface YGMeasureFunc {
    (node: YGNode, width: number, widthMode: YGMeasureMode, height: number, heightMode: YGMeasureMode, contextFn?: any): YGSize;
}
export interface YGBaselineFunc {
    (node: YGNode, width: number, height: number, contextFn?: any): number;
}
export interface YGDirtiedFunc {
    (node: YGNode): void;
}
export interface YGLogger {
    (config: YGConfig, node: YGNode, level: YGLogLevel, format: string, ...args: any[]): void;
}
export interface YGCloneNodeFunc {
    (oldNode: YGNode, owner: YGNode, childIndex: number, cloneContext?: any): YGNode;
}
export interface YGNodeCleanupFunc {
    (node: YGNode): void;
}
export declare function YGFloatIsUndefined(value: number): boolean;
export declare function YGComputedEdgeValue(edges: Array<YGValue>, edge: YGEdge, defaultValue: YGValue): YGValue;
export declare function YGNodeGetContext(node: YGNode): unknown;
export declare function YGNodeSetContext(node: YGNode, context: unknown): void;
export declare function YGNodeSetMeasureFunc(node: YGNode, measureFunc: YGMeasureFunc): void;
export declare function YGNodeSetBaselineFunc(node: YGNode, baselineFunc: YGBaselineFunc): void;
export declare function YGNodeGetDirtiedFunc(node: YGNode): YGDirtiedFunc;
export declare function YGNodeSetDirtiedFunc(node: YGNode, dirtiedFunc: YGDirtiedFunc): void;
export declare function YGNodeSetPrintFunc(node: YGNode, printFunc: YGPrintFunc): void;
export declare function YGNodeGetHasNewLayout(node: YGNode): boolean;
export declare function YGNodeSetHasNewLayout(node: YGNode, hasNewLayout: boolean): void;
export declare function YGNodeGetNodeType(node: YGNode): YGNodeType;
export declare function YGNodeSetNodeType(node: YGNode, nodeType: YGNodeType): void;
export declare function YGNodeIsDirty(node: YGNode): boolean;
export declare function YGNodeLayoutGetDidUseLegacyFlag(node: YGNode): boolean;
export declare function YGNodeMarkDirtyAndPropogateToDescendants(node: YGNode): void;
export declare function YGNodeNewWithConfig(config: YGConfig): YGNode;
export declare function YGConfigGetDefault(): YGConfig;
export declare function YGNodeNew(): YGNode;
export declare function YGNodeClone(oldNode: YGNode): YGNode;
export declare function YGConfigClone(oldConfig: YGConfig): YGConfig;
export declare function YGNodeDeepClone(oldNode: YGNode): YGNode;
export declare function YGNodeFree(node: YGNode): void;
export declare function YGConfigFreeRecursive(root: YGNode): void;
export declare function YGNodeFreeRecursiveWithCleanupFunc(root: YGNode, cleanup: YGNodeCleanupFunc): void;
export declare function YGNodeFreeRecursive(root: YGNode): void;
export declare function YGNodeReset(node: YGNode): void;
export declare function YGConfigGetInstanceCount(): number;
export declare function YGConfigNew(): YGConfig;
export declare function YGConfigFree(config: YGConfig): void;
export declare function YGConfigCopy(dest: YGConfig, src: YGConfig): void;
export declare function YGNodeSetIsReferenceBaseline(node: YGNode, isReferenceBaseline: boolean): void;
export declare function YGNodeIsReferenceBaseline(node: YGNode): boolean;
export declare function YGNodeInsertChild(owner: YGNode, child: YGNode, index: number): void;
export declare function YGNodeRemoveChild(owner: YGNode, excludedChild: YGNode): void;
export declare function YGNodeRemoveAllChildren(owner: YGNode): void;
export declare function YGNodeSetChildrenInternal(owner: YGNode, children: Array<YGNode>): void;
export declare function YGNodeSetChildren(owner: YGNode, children: Array<YGNode>): void;
export declare function YGNodeGetChild(node: YGNode, index: number): YGNode;
export declare function YGNodeGetChildCount(node: YGNode): number;
export declare function YGNodeGetOwner(node: YGNode): YGNode;
export declare function YGNodeGetParent(node: YGNode): YGNode;
export declare function YGNodeMarkDirty(node: YGNode): void;
export declare function YGNodeCopyStyle(dstNode: YGNode, srcNode: YGNode): void;
export declare function YGNodeStyleGetFlexGrow(node: YGNode): number;
export declare function YGNodeStyleGetFlexShrink(node: YGNode): number;
export declare function YGNodeStyleSetDirection(node: YGNode, direction: YGDirection): void;
export declare function YGNodeStyleGetDirection(node: YGNode): YGDirection;
export declare function YGNodeStyleSetFlexDirection(node: YGNode, flexDirection: YGFlexDirection): void;
export declare function YGNodeStyleGetFlexDirection(node: YGNode): YGFlexDirection;
export declare function YGNodeStyleSetJustifyContent(node: YGNode, justifyContent: YGJustify): void;
export declare function YGNodeStyleGetJustifyContent(node: YGNode): YGJustify;
export declare function YGNodeStyleSetAlignContent(node: YGNode, alignContent: YGAlign): void;
export declare function YGNodeStyleGetAlignContent(node: YGNode): YGAlign;
export declare function YGNodeStyleSetAlignItems(node: YGNode, alignItems: YGAlign): void;
export declare function YGNodeStyleGetAlignItems(node: YGNode): YGAlign;
export declare function YGNodeStyleSetAlignSelf(node: YGNode, alignSelf: YGAlign): void;
export declare function YGNodeStyleGetAlignSelf(node: YGNode): YGAlign;
export declare function YGNodeStyleSetPositionType(node: YGNode, positionType: YGPositionType): void;
export declare function YGNodeStyleGetPositionType(node: YGNode): YGPositionType;
export declare function YGNodeStyleSetFlexWrap(node: YGNode, flexWrap: YGWrap): void;
export declare function YGNodeStyleGetFlexWrap(node: YGNode): YGWrap;
export declare function YGNodeStyleSetOverflow(node: YGNode, overflow: YGOverflow): void;
export declare function YGNodeStyleGetOverflow(node: YGNode): YGOverflow;
export declare function YGNodeStyleSetDisplay(node: YGNode, display: YGDisplay): void;
export declare function YGNodeStyleGetDisplay(node: YGNode): YGDisplay;
export declare function YGNodeStyleSetPosition(node: YGNode, edge: YGEdge, position: number): void;
export declare function YGNodeStyleSetPositionPercent(node: YGNode, edge: YGEdge, position: number): void;
export declare function YGNodeStyleGetPosition(node: YGNode, edge: YGEdge): YGValue;
export declare function YGNodeStyleSetMargin(node: YGNode, edge: YGEdge, margin: number): void;
export declare function YGNodeStyleSetMarginPercent(node: YGNode, edge: YGEdge, margin: number): void;
export declare function YGNodeStyleGetMargin(node: YGNode, edge: YGEdge): YGValue;
export declare function YGNodeStyleSetPadding(node: YGNode, edge: YGEdge, padding: number): void;
export declare function YGNodeStyleSetPaddingPercent(node: YGNode, edge: YGEdge, padding: number): void;
export declare function YGNodeStyleGetPadding(node: YGNode, edge: YGEdge): YGValue;
export declare function YGNodeStyleSetMarginAuto(node: YGNode, edge: YGEdge): void;
export declare function YGNodeStyleSetWidth(node: YGNode, width: number): void;
export declare function YGNodeStyleSetWidthPercent(node: YGNode, width: number): void;
export declare function YGNodeStyleSetWidthAuto(node: YGNode): void;
export declare function YGNodeStyleGetWidth(node: YGNode): YGValue;
export declare function YGNodeStyleSetHeight(node: YGNode, height: number): void;
export declare function YGNodeStyleSetHeightPercent(node: YGNode, height: number): void;
export declare function YGNodeStyleSetHeightAuto(node: YGNode): void;
export declare function YGNodeStyleGetHeight(node: YGNode): YGValue;
export declare function YGNodeStyleSetMinWidth(node: YGNode, minWidth: number): void;
export declare function YGNodeStyleSetMinWidthPercent(node: YGNode, minWidth: number): void;
export declare function YGNodeStyleGetMinWidth(node: YGNode): YGValue;
export declare function YGNodeStyleSetMinHeight(node: YGNode, minHeight: number): void;
export declare function YGNodeStyleSetMinHeightPercent(node: YGNode, minHeight: number): void;
export declare function YGNodeStyleGetMinHeight(node: YGNode): YGValue;
export declare function YGNodeStyleSetMaxWidth(node: YGNode, maxWidth: number): void;
export declare function YGNodeStyleSetMaxWidthPercent(node: YGNode, maxWidth: number): void;
export declare function YGNodeStyleGetMaxWidth(node: YGNode): YGValue;
export declare function YGNodeStyleSetMaxHeight(node: YGNode, maxHeight: number): void;
export declare function YGNodeStyleSetMaxHeightPercent(node: YGNode, maxHeight: number): void;
export declare function YGNodeStyleGetMaxHeight(node: YGNode): YGValue;
export declare function YGNodeLayoutGetLeft(node: YGNode): number;
export declare function YGNodeLayoutGetTop(node: YGNode): number;
export declare function YGNodeLayoutGetRight(node: YGNode): number;
export declare function YGNodeLayoutGetBottom(node: YGNode): number;
export declare function YGNodeLayoutGetWidth(node: YGNode): number;
export declare function YGNodeLayoutGetHeight(node: YGNode): number;
export declare function YGNodeLayoutGetDirection(node: YGNode): YGDirection;
export declare function YGNodeLayoutGetHadOverflow(node: YGNode): boolean;
export declare function YGNodeLayoutGetMargin(node: YGNode, edge_: YGEdge): number;
export declare function YGNodeLayoutGetBorder(node: YGNode, edge_: YGEdge): number;
export declare function YGNodeLayoutGetPadding(node: YGNode, edge_: YGEdge): number;
export declare function YGNodeStyleSetFlex(node: YGNode, flex: number): void;
export declare function YGNodeStyleGetFlex(node: YGNode): number;
export declare function YGNodeStyleSetFlexGrow(node: YGNode, flexGrow: number): void;
export declare function YGNodeStyleSetFlexShrink(node: YGNode, flexShrink: number): void;
export declare function YGNodeStyleGetFlexBasis(node: YGNode): YGValue;
export declare function YGNodeStyleSetFlexBasis(node: YGNode, flexBasis: number): void;
export declare function YGNodeStyleSetFlexBasisPercent(node: YGNode, flexBasisPercent: number): void;
export declare function YGNodeStyleSetFlexBasisAuto(node: YGNode): void;
export declare function YGNodeStyleSetBorder(node: YGNode, edge: YGEdge, border: number): void;
export declare function YGNodeStyleGetBorder(node: YGNode, edge: YGEdge): number;
export declare function YGNodeStyleGetAspectRatio(node: YGNode): number;
export declare function YGNodeStyleSetAspectRatio(node: YGNode, aspectRatio: number): void;
export declare function YGNodeLayoutGetDidLegacyStretchFlagAffectLayout(node: YGNode): boolean;
export declare function YGNodePrintInternal(node: YGNode, options: YGPrintOptions): void;
export declare function YGNodePrint(node: YGNode, options: YGPrintOptions): void;
export declare function YGNodePaddingAndBorderForAxis(node: YGNode, axis: YGFlexDirection, widthSize: number): number;
export declare function YGNodeAlignItem(node: YGNode, child: YGNode): YGAlign;
export declare function YGBaseline(node: YGNode, layoutContext: any): number;
export declare function YGIsBaselineLayout(node: YGNode): boolean;
export declare function YGNodeDimWithMargin(node: YGNode, axis: YGFlexDirection, widthSize: number): number;
export declare function YGNodeIsStyleDimDefined(node: YGNode, axis: YGFlexDirection, ownerSize: number): boolean;
export declare function YGNodeIsLayoutDimDefined(node: YGNode, axis: YGFlexDirection): boolean;
export declare function YGNodeBoundAxisWithinMinAndMax(node: YGNode, axis: YGFlexDirection, value: YGFloatOptional, axisSize: number): YGFloatOptional;
export declare function YGNodeBoundAxis(node: YGNode, axis: YGFlexDirection, value: number, axisSize: number, widthSize: number): number;
export declare function YGNodeSetChildTrailingPosition(node: YGNode, child: YGNode, axis: YGFlexDirection): void;
export declare function YGConstrainMaxSizeForMode(node: YGNode, axis: YGFlexDirection, ownerAxisSize: number, ownerWidth: number, mode: {
    value: YGMeasureMode;
}, size: {
    value: number;
}): void;
export declare function YGNodeComputeFlexBasisForChild(node: YGNode, child: YGNode, width: number, widthMode: YGMeasureMode, height: number, ownerWidth: number, ownerHeight: number, heightMode: YGMeasureMode, direction: YGDirection, config: YGConfig, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number): void;
export declare function YGNodeAbsoluteLayoutChild(node: YGNode, child: YGNode, width: number, widthMode: YGMeasureMode, height: number, direction: YGDirection, config: YGConfig, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number): void;
export declare function YGNodeWithMeasureFuncSetMeasuredDimensions(node: YGNode, availableWidth: number, availableHeight: number, widthMeasureMode: YGMeasureMode, heightMeasureMode: YGMeasureMode, ownerWidth: number, ownerHeight: number, layoutMarkerData: LayoutData, layoutContext: any, reason: LayoutPassReason): void;
export declare function YGNodeEmptyContainerSetMeasuredDimensions(node: YGNode, availableWidth: number, availableHeight: number, widthMeasureMode: YGMeasureMode, heightMeasureMode: YGMeasureMode, ownerWidth: number, ownerHeight: number): void;
export declare function YGNodeFixedSizeSetMeasuredDimensions(node: YGNode, availableWidth: number, availableHeight: number, widthMeasureMode: YGMeasureMode, heightMeasureMode: YGMeasureMode, ownerWidth: number, ownerHeight: number): boolean;
export declare function YGZeroOutLayoutRecursivly(node: YGNode, layoutContext: any): void;
export declare function YGNodeCalculateAvailableInnerDim(node: YGNode, dimension: YGDimension, availableDim: number, paddingAndBorder: number, ownerDim: number): number;
export declare function YGNodeComputeFlexBasisForChildren(node: YGNode, availableInnerWidth: number, availableInnerHeight: number, widthMeasureMode: YGMeasureMode, heightMeasureMode: YGMeasureMode, direction: YGDirection, mainAxis: YGFlexDirection, config: YGConfig, performLayout: boolean, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number): number;
export declare function YGCalculateCollectFlexItemsRowValues(node: YGNode, ownerDirection: YGDirection, mainAxisownerSize: number, availableInnerWidth: number, availableInnerMainDim: number, startOfLineIndex: number, lineCount: number): YGCollectFlexItemsRowValues;
export declare function YGDistributeFreeSpaceSecondPass(collectedFlexItemsValues: YGCollectFlexItemsRowValues, node: YGNode, mainAxis: YGFlexDirection, crossAxis: YGFlexDirection, mainAxisownerSize: number, availableInnerMainDim: number, availableInnerCrossDim: number, availableInnerWidth: number, availableInnerHeight: number, flexBasisOverflows: boolean, measureModeCrossDim: YGMeasureMode, performLayout: boolean, config: YGConfig, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number): number;
export declare function YGDistributeFreeSpaceFirstPass(collectedFlexItemsValues: YGCollectFlexItemsRowValues, mainAxis: YGFlexDirection, mainAxisownerSize: number, availableInnerMainDim: number, availableInnerWidth: number): void;
export declare function YGResolveFlexibleLength(node: YGNode, collectedFlexItemsValues: YGCollectFlexItemsRowValues, mainAxis: YGFlexDirection, crossAxis: YGFlexDirection, mainAxisownerSize: number, availableInnerMainDim: number, availableInnerCrossDim: number, availableInnerWidth: number, availableInnerHeight: number, flexBasisOverflows: boolean, measureModeCrossDim: YGMeasureMode, performLayout: boolean, config: YGConfig, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number): void;
export declare function YGJustifyMainAxis(node: YGNode, collectedFlexItemsValues: YGCollectFlexItemsRowValues, startOfLineIndex: number, mainAxis: YGFlexDirection, crossAxis: YGFlexDirection, measureModeMainDim: YGMeasureMode, measureModeCrossDim: YGMeasureMode, mainAxisownerSize: number, ownerWidth: number, availableInnerMainDim: number, availableInnerCrossDim: number, availableInnerWidth: number, performLayout: boolean, layoutContext: any): void;
export declare function YGNodelayoutImpl(node: YGNode, availableWidth: number, availableHeight: number, ownerDirection: YGDirection, widthMeasureMode: YGMeasureMode, heightMeasureMode: YGMeasureMode, ownerWidth: number, ownerHeight: number, performLayout: boolean, config: YGConfig, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number, reason: LayoutPassReason): void;
export declare function YGSpacer(level: number): string;
export declare function YGMeasureModeName(mode: YGMeasureMode, performLayout: boolean): string;
export declare function YGMeasureModeSizeIsExactAndMatchesOldMeasuredSize(sizeMode: YGMeasureMode, size: number, lastComputedSize: number): boolean;
export declare function YGMeasureModeOldSizeIsUnspecifiedAndStillFits(sizeMode: YGMeasureMode, size: number, lastSizeMode: YGMeasureMode, lastComputedSize: number): boolean;
export declare function YGMeasureModeNewMeasureSizeIsStricterAndStillValid(sizeMode: YGMeasureMode, size: number, lastSizeMode: YGMeasureMode, lastSize: number, lastComputedSize: number): boolean;
export declare function YGRoundValueToPixelGrid(value: number, pointScaleFactor: number, forceCeil: boolean, forceFloor: boolean): number;
export declare function YGNodeCanUseCachedMeasurement(widthMode: YGMeasureMode, width: number, heightMode: YGMeasureMode, height: number, lastWidthMode: YGMeasureMode, lastWidth: number, lastHeightMode: YGMeasureMode, lastHeight: number, lastComputedWidth: number, lastComputedHeight: number, marginRow: number, marginColumn: number, config: YGConfig): boolean;
export declare function YGLayoutNodeInternal(node: YGNode, availableWidth: number, availableHeight: number, ownerDirection: YGDirection, widthMeasureMode: YGMeasureMode, heightMeasureMode: YGMeasureMode, ownerWidth: number, ownerHeight: number, performLayout: boolean, reason: LayoutPassReason, config: YGConfig, layoutMarkerData: LayoutData, layoutContext: any, depth: number, generationCount: number): boolean;
export declare function YGConfigSetPointScaleFactor(config: YGConfig, pixelsInPoint: number): void;
export declare function YGRoundToPixelGrid(node: YGNode, pointScaleFactor: number, absoluteLeft: number, absoluteTop: number): void;
export declare function YGNodeCalculateLayoutWithContext(node: YGNode, ownerWidth: number, ownerHeight: number, ownerDirection: YGDirection, layoutContext: any): void;
export declare function YGNodeCalculateLayout(node: YGNode, ownerWidth: number, ownerHeight: number, ownerDirection: YGDirection): void;
export declare function YGConfigSetLogger(config: YGConfig, logger: YGLogger): void;
export declare function YGConfigSetShouldDiffLayoutWithoutLegacyStretchBehaviour(config: YGConfig, shouldDiffLayout: boolean): void;
export declare function YGAssert(condition: boolean, message: string): void;
export declare function YGAssertWithNode(node: YGNode, condition: boolean, message: string): asserts condition;
export declare function YGAssertWithConfig(config: YGConfig, condition: boolean, message: string): void;
export declare function YGConfigSetExperimentalFeatureEnabled(config: YGConfig, feature: YGExperimentalFeature, enabled: boolean): void;
export declare function YGConfigIsExperimentalFeatureEnabled(config: YGConfig, feature: YGExperimentalFeature): boolean;
export declare function YGConfigSetUseWebDefaults(config: YGConfig, enabled: boolean): void;
export declare function YGConfigSetUseLegacyStretchBehaviour(config: YGConfig, useLegacyStretchBehaviour: boolean): void;
export declare function YGConfigGetUseWebDefaults(config: YGConfig): boolean;
export declare function YGConfigSetContext(config: YGConfig, context: any): void;
export declare function YGConfigGetContext(config: YGConfig): any;
export declare function YGConfigSetCloneNodeFunc(config: YGConfig, callback: YGCloneNodeFunc): void;
export declare function YGTraverseChildrenPreOrder(children: Array<YGNode>, f: (node: YGNode) => void): void;
export declare function YGTraversePreOrder(node: YGNode, f: (node: YGNode) => void): void;