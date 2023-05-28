// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGNode.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGNode.cpp
import { YGFlexDirection, YGDirection, YGNodeType, YGUnit, YGEdge, YGDimension, YGPositionType, YGAlign, } from './enums.js';
import { YGFloatOptional } from './ygfloatoptional.js';
import { YGConfig } from './ygconfig.js';
import { YGFlexDirectionIsRow, YGResolveValue, YGResolveValueMargin, YGFloatOptionalMax, YGFloatMax, YGFlexDirectionCross, YGResolveFlexDirection, YGValueEqual, } from './utils.js';
import { YGLayout } from './yglayout.js';
import { YGStyle } from './ygstyle.js';
import { trailing, leading, kDefaultFlexGrow, kDefaultFlexShrink, kWebDefaultFlexShrink } from './internal.js';
import { YGAssertWithNode } from './yoga.js';
import { YGValueUndefined, YGValueZero, YGValueAuto } from './ygvalue.js';
class YGNode {
    context_;
    print_;
    hasNewLayout_;
    isReferenceBaseline_;
    nodeType_;
    measure_;
    baseline_;
    dirtied_;
    style_;
    layout_;
    lineIndex_;
    owner_;
    children_;
    config_;
    isDirty_;
    resolvedDimensions_;
    relativePosition(axis, axisSize) {
        if (this.isLeadingPositionDefined(axis)) {
            return this.getLeadingPosition(axis, axisSize);
        }
        const trailingPosition = this.getTrailingPosition(axis, axisSize);
        if (!trailingPosition.isUndefined()) {
            trailingPosition.setValue(-1 * trailingPosition.getValue());
        }
        return trailingPosition;
    }
    constructor(contextOrNodeOrConfig = null, print = null, hasNewLayout = true, isReferenceBaseline = false, nodeType = YGNodeType.Default, measure = null, baseline = null, dirtied = null, style = new YGStyle(), layout = new YGLayout(), lineIndex = 0, owner = null, children = [], config = null, isDirty = false, resolvedDimensions = [YGValueUndefined(), YGValueUndefined()]) {
        if (contextOrNodeOrConfig instanceof YGNode) {
            console.log('from node');
            this.fromNode(contextOrNodeOrConfig);
            return;
        }
        this.initialize(print, hasNewLayout, isReferenceBaseline, nodeType, measure, baseline, dirtied, style, layout, lineIndex, owner, children, config, isDirty, resolvedDimensions);
        if (contextOrNodeOrConfig instanceof YGConfig) {
            this.config_ = contextOrNodeOrConfig;
            this.context_ = null;
        }
        else {
            this.context_ = contextOrNodeOrConfig;
        }
    }
    initialize(print = null, hasNewLayout = true, isReferenceBaseline = false, nodeType = YGNodeType.Default, measure = null, baseline = null, dirtied = null, style = new YGStyle(), layout = new YGLayout(), lineIndex = 0, owner = null, children = [], config = null, isDirty = false, resolvedDimensions = [YGValueUndefined(), YGValueUndefined()]) {
        this.print_ = print;
        this.hasNewLayout_ = hasNewLayout;
        this.isReferenceBaseline_ = isReferenceBaseline;
        this.nodeType_ = nodeType;
        this.measure_ = measure;
        this.baseline_ = baseline;
        this.dirtied_ = dirtied;
        this.style_ = style;
        this.layout_ = layout;
        this.lineIndex_ = lineIndex;
        this.owner_ = owner;
        this.children_ = children;
        this.config_ = config;
        this.isDirty_ = isDirty;
        this.resolvedDimensions_ = resolvedDimensions;
        this.context_ = null;
    }
    operatorAtrib(node) {
        if (node == this) {
            return this;
        }
        this.clearChildren();
        this.fromNode(node);
        return this;
    }
    fromNode(node) {
        console.log(node);
        this.context_ = node.context_;
        this.print_ = node.print_;
        this.hasNewLayout_ = node.hasNewLayout_;
        this.isReferenceBaseline_ = node.isReferenceBaseline_;
        this.nodeType_ = node.nodeType_;
        this.measure_ = node.measure_;
        this.baseline_ = node.baseline_;
        this.dirtied_ = node.dirtied_;
        this.style_ = node.style_; //
        // this.style_ = node.style_.clone();
        this.layout_ = node.layout_; //
        // this.layout_ = node.layout_.clone();
        this.lineIndex_ = node.lineIndex_;
        this.owner_ = node.owner_;
        this.children_ = node.children_; //
        // let newChildren: Array<YGNode> = new Array(node.children_.length);
        // for(let i = 0; i < node.children_.length; ++i) {
        //     newChildren[i] = node.children_[i]
        // }
        // this.children_ = newChildren;
        this.config_ = node.config_;
        this.isDirty_ = node.isDirty_;
        this.resolvedDimensions_ = node.resolvedDimensions_; //
        // this.resolvedDimensions_ = [node.resolvedDimensions_[0].clone(), node.resolvedDimensions_[1].clone()];
    }
    print(printContext) {
        if (this.print_ != null) {
            this.print_(this, printContext);
        }
    }
    computeEdgeValueForRow(edges, rowEdge, edge, defaultValue) {
        if (!edges[rowEdge].isUndefined()) {
            return edges[rowEdge];
        }
        else if (!edges[edge].isUndefined()) {
            return edges[edge];
        }
        else if (!edges[YGEdge.Horizontal].isUndefined()) {
            return edges[YGEdge.Horizontal];
        }
        else if (!edges[YGEdge.All].isUndefined()) {
            return edges[YGEdge.All];
        }
        else {
            return defaultValue;
        }
    }
    computeEdgeValueForColumn(edges, edge, defaultValue) {
        if (!edges[edge].isUndefined()) {
            return edges[edge];
        }
        else if (!edges[YGEdge.Vertical].isUndefined()) {
            return edges[YGEdge.Vertical];
        }
        else if (!edges[YGEdge.All].isUndefined()) {
            return edges[YGEdge.All];
        }
        else {
            return defaultValue;
        }
    }
    measure(width, widthMode, height, heightMode, layoutContext) {
        return this.measure_(this, width, widthMode, height, heightMode, layoutContext);
    }
    baseline(width, height, layoutContext) {
        return this.baseline_(this, width, height, layoutContext);
    }
    // TODO: Move useWebDefaults to the node and not the config?
    useWebDefaults() {
        this.config_.useWebDefaults = true;
        this.style_.flexDirection = YGFlexDirection.Row;
        this.style_.alignContent = YGAlign.Stretch;
    }
    hasMeasureFunc() {
        return this.measure_ != null;
    }
    hasBaselineFunc() {
        return this.baseline_ != null;
    }
    getContext() {
        return this.context_;
    }
    getHasNewLayout() {
        return this.hasNewLayout_;
    }
    getNodeType() {
        return this.nodeType_;
    }
    getDirtied() {
        return this.dirtied_;
    }
    getStyle() {
        return this.style_;
    }
    getLayout() {
        return this.layout_;
    }
    getLineIndex() {
        return this.lineIndex_;
    }
    isReferenceBaseline() {
        return this.isReferenceBaseline_;
    }
    getOwner() {
        return this.owner_;
    }
    getParent() {
        return this.getOwner();
    }
    getChildren() {
        return this.children_;
    }
    getChildrenCount() {
        return this.children_.length;
    }
    getChild(index) {
        return this.children_[index];
    }
    getConfig() {
        return this.config_;
    }
    isDirty() {
        return this.isDirty_;
    }
    getResolvedDimensions() {
        return this.resolvedDimensions_;
    }
    getResolvedDimension(index) {
        return this.resolvedDimensions_[index];
    }
    getLeadingPosition(axis, axisSize) {
        const leadingPosition = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.position, YGEdge.Start, leading[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.position, leading[axis], YGValueZero());
        return YGResolveValue(leadingPosition, axisSize);
    }
    isLeadingPositionDefined(axis) {
        const leadingPosition = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.position, YGEdge.Start, leading[axis], YGValueUndefined())
            : this.computeEdgeValueForColumn(this.style_.position, leading[axis], YGValueUndefined());
        return !leadingPosition.isUndefined();
    }
    isTrailingPosDefined(axis) {
        const trailingPosition = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.position, YGEdge.End, trailing[axis], YGValueUndefined())
            : this.computeEdgeValueForColumn(this.style_.position, trailing[axis], YGValueUndefined());
        return !trailingPosition.isUndefined();
    }
    getTrailingPosition(axis, axisSize) {
        const trailingPosition = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.position, YGEdge.End, trailing[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.position, trailing[axis], YGValueZero());
        return YGResolveValue(trailingPosition, axisSize);
    }
    getLeadingMargin(axis, widthSize) {
        const leadingMargin = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.margin, YGEdge.Start, leading[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.margin, leading[axis], YGValueZero());
        return YGResolveValueMargin(leadingMargin, widthSize);
    }
    getTrailingMargin(axis, widthSize) {
        const trailingMargin = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.margin, YGEdge.End, trailing[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.margin, trailing[axis], YGValueZero());
        return YGResolveValueMargin(trailingMargin, widthSize);
    }
    getLeadingBorder(axis) {
        const leadingBorder = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.border, YGEdge.Start, leading[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.border, leading[axis], YGValueZero());
        return YGFloatMax(leadingBorder.value, 0.0);
    }
    getTrailingBorder(axis) {
        const trailingBorder = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.border, YGEdge.End, trailing[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.border, trailing[axis], YGValueZero());
        return YGFloatMax(trailingBorder.value, 0.0);
    }
    getLeadingPadding(axis, widthSize) {
        const leadingPadding = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.padding, YGEdge.Start, leading[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.padding, leading[axis], YGValueZero());
        return YGFloatOptionalMax(YGResolveValue(leadingPadding, widthSize), new YGFloatOptional(0.0));
    }
    getTrailingPadding(axis, widthSize) {
        const trailingPadding = YGFlexDirectionIsRow(axis)
            ? this.computeEdgeValueForRow(this.style_.padding, YGEdge.End, trailing[axis], YGValueZero())
            : this.computeEdgeValueForColumn(this.style_.padding, trailing[axis], YGValueZero());
        return YGFloatOptionalMax(YGResolveValue(trailingPadding, widthSize), new YGFloatOptional(0.0));
    }
    getLeadingPaddingAndBorder(axis, widthSize) {
        return this.getLeadingPadding(axis, widthSize).add(new YGFloatOptional(this.getLeadingBorder(axis)));
    }
    getTrailingPaddingAndBorder(axis, widthSize) {
        return this.getTrailingPadding(axis, widthSize).add(new YGFloatOptional(this.getTrailingBorder(axis)));
    }
    getMarginForAxis(axis, widthSize) {
        return this.getLeadingMargin(axis, widthSize).add(this.getTrailingMargin(axis, widthSize));
    }
    setContext(context) {
        this.context_ = context;
    }
    setPrintFunc(printFunc) {
        this.print_ = printFunc;
    }
    setHasNewLayout(hasNewLayout) {
        this.hasNewLayout_ = hasNewLayout;
    }
    setNodeType(nodeType) {
        this.nodeType_ = nodeType;
    }
    /**
     * deviation: Upstream uses method overloading with a union for callbacks
     * with and without context functions. TypeScript doesn't support method
     * overloading in classes the same way C++ does, so the context function is
     * made an optional parameter of YGMeasureFunc.
     */
    setMeasureFunc(measureFunc) {
        if (measureFunc == null) {
            this.setNodeType(YGNodeType.Default);
        }
        else {
            //YGAssertWithNode(this, this.children_.size() == 0, "Cannot set measure function: Nodes with measure functions cannot have children.");
            if (this.children_.length != 0) {
                console.error('Cannot set measure function: Nodes with measure functions cannot have children.');
            }
            this.setNodeType(YGNodeType.Text);
        }
        this.measure_ = measureFunc;
    }
    setBaseLineFunc(baseLineFunc) {
        this.baseline_ = baseLineFunc;
    }
    setDirtiedFunc(dirtiedFunc) {
        this.dirtied_ = dirtiedFunc;
    }
    setStyle(style) {
        this.style_ = style;
    }
    setStyleFlexDirection(direction) {
        this.style_.flexDirection = direction;
    }
    setStyleAlignContent(alignContent) {
        this.style_.alignContent = alignContent;
    }
    setLayout(layout) {
        this.layout_ = layout;
    }
    setLineIndex(lineIndex) {
        this.lineIndex_ = lineIndex;
    }
    setIsReferenceBaseline(isReferenceBaseline) {
        this.isReferenceBaseline_ = isReferenceBaseline;
    }
    setOwner(owner) {
        this.owner_ = owner;
    }
    setChildren(children) {
        this.children_ = children;
    }
    setConfig(config) {
        this.config_ = config;
    }
    setDirty(isDirty) {
        if (isDirty == this.isDirty_) {
            return;
        }
        this.isDirty_ = isDirty;
        if (isDirty && this.dirtied_) {
            this.dirtied_(this);
        }
    }
    setLayoutLastOwnerDirection(direction) {
        this.layout_.lastOwnerDirection = direction;
    }
    setLayoutComputedFlexBasis(computedFlexBasis) {
        this.layout_.computedFlexBasis = computedFlexBasis;
    }
    setLayoutComputedFlexBasisGeneration(computedFlexBasisGeneration) {
        this.layout_.computedFlexBasisGeneration = computedFlexBasisGeneration;
    }
    setLayoutMeasuredDimension(measuredDimension, index) {
        this.layout_.measuredDimensions[index] = measuredDimension;
    }
    setLayoutHadOverflow(hadOverflow) {
        this.layout_.hadOverflow = hadOverflow;
    }
    setLayoutDimension(dimension, index) {
        this.layout_.dimensions[index] = dimension;
    }
    setLayoutDirection(direction) {
        this.layout_.direction = direction;
    }
    setLayoutMargin(margin, index) {
        this.layout_.margin[index] = margin;
    }
    setLayoutBorder(border, index) {
        this.layout_.border[index] = border;
    }
    setLayoutPadding(padding, index) {
        this.layout_.padding[index] = padding;
    }
    setLayoutPosition(position, index) {
        this.layout_.position[index] = position;
    }
    setPosition(direction, mainSize, crossSize, ownerWidth) {
        const directionRespectingRoot = this.owner_ != null ? direction : YGDirection.LTR;
        const mainAxis = YGResolveFlexDirection(this.style_.flexDirection, directionRespectingRoot);
        const crossAxis = YGFlexDirectionCross(mainAxis, directionRespectingRoot);
        const relativePositionMain = this.relativePosition(mainAxis, mainSize);
        const relativePositionCross = this.relativePosition(crossAxis, crossSize);
        this.setLayoutPosition(this.getLeadingMargin(mainAxis, ownerWidth).add(relativePositionMain).unwrap(), leading[mainAxis]);
        this.setLayoutPosition(this.getTrailingMargin(mainAxis, ownerWidth).add(relativePositionMain).unwrap(), trailing[mainAxis]);
        this.setLayoutPosition(this.getLeadingMargin(crossAxis, ownerWidth).add(relativePositionCross).unwrap(), leading[crossAxis]);
        this.setLayoutPosition(this.getTrailingMargin(crossAxis, ownerWidth).add(relativePositionCross).unwrap(), trailing[crossAxis]);
    }
    setLayoutDoesLegacyFlagAffectsLayout(doesLegacyFlagAffectsLayout) {
        this.layout_.doesLegacyStretchFlagAffectsLayout = doesLegacyFlagAffectsLayout;
    }
    setLayoutDidUseLegacyFlag(didUseLegacyFlag) {
        this.layout_.didUseLegacyFlag = didUseLegacyFlag;
    }
    markDirtyAndPropogateDownwards() {
        this.isDirty_ = true;
        for (let i = 0; i < this.children_.length; i++) {
            this.children_[i].markDirtyAndPropogateDownwards();
        }
    }
    marginLeadingValue(axis) {
        if (YGFlexDirectionIsRow(axis) && this.style_.margin[YGEdge.Start].unit != YGUnit.Undefined) {
            return this.style_.margin[YGEdge.Start];
        }
        else {
            return this.style_.margin[leading[axis]];
        }
    }
    marginTrailingValue(axis) {
        if (YGFlexDirectionIsRow(axis) && this.style_.margin[YGEdge.End].unit != YGUnit.Undefined) {
            return this.style_.margin[YGEdge.End];
        }
        else {
            return this.style_.margin[trailing[axis]];
        }
    }
    resolveFlexBasisPtr() {
        const flexBasis = this.style_.flexBasis;
        if (flexBasis.unit != YGUnit.Auto && flexBasis.unit != YGUnit.Undefined) {
            return flexBasis;
        }
        if (!this.style_.flex.isUndefined() && this.style_.flex.getValue() > 0.0) {
            return this.config_.useWebDefaults ? YGValueAuto() : YGValueZero();
        }
        return YGValueAuto();
    }
    resolveDimension() {
        const style = this.getStyle();
        for (const dim of [YGDimension.Width, YGDimension.Height]) {
            if (!style.maxDimensions[dim].isUndefined() &&
                YGValueEqual(style.maxDimensions[dim], style.minDimensions[dim])) {
                this.resolvedDimensions_[dim] = style.maxDimensions[dim];
            }
            else {
                this.resolvedDimensions_[dim] = style.dimensions[dim];
            }
        }
    }
    resolveDirection(ownerDirection) {
        if (this.style_.direction == YGDirection.Inherit) {
            return ownerDirection > YGDirection.Inherit ? ownerDirection : YGDirection.LTR;
        }
        else {
            return this.style_.direction;
        }
    }
    clearChildren() {
        while (this.children_.length > 0) {
            this.children_.pop();
        }
    }
    replaceChild(oldChild, newChild) {
        const index = this.children_.indexOf(oldChild);
        if (index >= 0) {
            this.children_[index] = newChild;
        }
    }
    replaceChildIndex(child, index) {
        this.children_[index] = child;
    }
    insertChildIndex(child, index) {
        this.children_.splice(index, 0, child);
    }
    removeChild(child) {
        const index = this.children_.indexOf(child);
        if (index >= 0) {
            this.children_.splice(index, 1);
            return true;
        }
        return false;
    }
    removeChildIndex(index) {
        this.children_.splice(index, 1);
    }
    iterChildrenAfterCloningIfNeeded(callback, cloneContext) {
        let i = 0;
        for (let child of this.children_) {
            if (child.getOwner() != this) {
                child = this.config_.cloneNode(child, this, i, cloneContext);
                child.setOwner(this);
            }
            i += 1;
            callback(child, cloneContext);
        }
    }
    cloneChildrenIfNeeded(cloneContext) {
        this.iterChildrenAfterCloningIfNeeded((node, cloneContext) => { }, cloneContext);
    }
    markDirtyAndPropogate() {
        if (!this.isDirty_) {
            this.setDirty(true);
            this.setLayoutComputedFlexBasis(new YGFloatOptional());
            if (this.owner_) {
                this.owner_.markDirtyAndPropogate();
            }
        }
    }
    resolveFlexGrow() {
        if (this.owner_ == null) {
            return 0.0;
        }
        if (!this.style_.flexGrow.isUndefined()) {
            return this.style_.flexGrow.unwrap();
        }
        if (!this.style_.flex.isUndefined() && this.style_.flex.unwrap() > 0.0) {
            return this.style_.flex.unwrap();
        }
        return kDefaultFlexGrow;
    }
    resolveFlexShrink() {
        if (this.owner_ == null) {
            return 0.0;
        }
        if (!this.style_.flexShrink.isUndefined()) {
            return this.style_.flexShrink.getValue();
        }
        if (!this.config_.useWebDefaults && !this.style_.flex.isUndefined() && this.style_.flex.getValue() < 0.0) {
            return -this.style_.flex.getValue();
        }
        return this.config_.useWebDefaults ? kWebDefaultFlexShrink : kDefaultFlexShrink;
    }
    isNodeFlexible() {
        return (this.style_.positionType != YGPositionType.Absolute &&
            (this.resolveFlexGrow() != 0 || this.resolveFlexShrink() != 0));
    }
    didUseLegacyFlag() {
        let didUseLegacyFlag = this.layout_.didUseLegacyFlag;
        if (didUseLegacyFlag) {
            return true;
        }
        for (let i = 0; i < this.children_.length; i++) {
            if (this.children_[i].getLayout().didUseLegacyFlag) {
                didUseLegacyFlag = true;
                break;
            }
        }
        return didUseLegacyFlag;
    }
    isLayoutTreeEqualToNode(node) {
        if (this.children_.length != node.getChildren().length) {
            return false;
        }
        if (this.layout_.diff(node.getLayout())) {
            return false;
        }
        if (this.children_.length == 0) {
            return true;
        }
        let isLayoutTreeEqual = true;
        for (let i = 0; i < this.children_.length; ++i) {
            const otherNodeChildren = node.getChild(i);
            isLayoutTreeEqual = this.children_[i].isLayoutTreeEqualToNode(otherNodeChildren);
            if (!isLayoutTreeEqual) {
                return false;
            }
        }
        return isLayoutTreeEqual;
    }
    reset() {
        YGAssertWithNode(this, this.children_.length == 0, 'Cannot reset a node which still has children attached');
        YGAssertWithNode(this, this.owner_ == null, 'Cannot reset a node still attached to a owner');
        this.clearChildren();
        // TODO: Move useWebDefaults to the node and not the config?
        const config = this.getConfig();
        const webDefaults = config.useWebDefaults;
        this.initialize();
        this.setConfig(config);
        if (webDefaults) {
            this.useWebDefaults();
        }
    }
}
export { YGNode };
//# sourceMappingURL=ygnode.js.map