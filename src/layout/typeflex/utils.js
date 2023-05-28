// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/Utils.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/Utils.cpp
import { YGUnit, YGFlexDirection, YGDirection } from './enums.js';
import { YGFloatOptional } from './ygfloatoptional.js';
import { YGFloatIsUndefined } from './yoga.js';
export class YGCollectFlexItemsRowValues {
    itemsOnLine = 0;
    sizeConsumedOnCurrentLine = 0;
    totalFlexGrowFactors = 0;
    totalFlexShrinkScaledFactors = 0;
    endOfLineIndex = 0;
    relativeChildren = [];
    remainingFreeSpace = 0;
    mainDim = 0;
    crossDim = 0;
}
export function YGValueEqual(a, b) {
    if (a.unit != b.unit) {
        return false;
    }
    if (a.unit == YGUnit.Undefined || (YGFloatIsUndefined(a.value) && YGFloatIsUndefined(b.value))) {
        return true;
    }
    return Math.abs(a.value - b.value) < 0.0001;
}
export function YGFloatsEqual(a, b) {
    if (!YGFloatIsUndefined(a) && !YGFloatIsUndefined(b)) {
        return Math.abs(a - b) < 0.0001;
    }
    return YGFloatIsUndefined(a) && YGFloatIsUndefined(b);
}
export function YGFloatMax(a, b) {
    if (!YGFloatIsUndefined(a) && !YGFloatIsUndefined(b)) {
        return Math.max(a, b);
    }
    return YGFloatIsUndefined(a) ? b : a;
}
export function YGFloatOptionalMax(op1, op2) {
    if (!op1.isUndefined() && !op2.isUndefined()) {
        return op1.getValue() > op2.getValue() ? op1 : op2;
    }
    return op1.isUndefined() ? op2 : op1;
}
export function YGFloatMin(a, b) {
    if (!YGFloatIsUndefined(a) && !YGFloatIsUndefined(b)) {
        return Math.min(a, b);
    }
    return YGFloatIsUndefined(a) ? b : a;
}
export function YGFloatArrayEqual(val1, val2) {
    let areEqual = true;
    for (let i = 0; i < val1.length && areEqual; ++i) {
        areEqual = YGFloatsEqual(val1[i], val2[i]);
    }
    return areEqual;
}
export function YGValueArrayEqual(val1, val2) {
    let areEqual = true;
    for (let i = 0; i < val1.length && areEqual; ++i) {
        areEqual = YGValueEqual(val1[i], val2[i]);
    }
    return areEqual;
}
export function YGFloatSanitize(val) {
    return YGFloatIsUndefined(val) ? 0 : val;
}
export function YGFlexDirectionCross(flexDirection, direction) {
    return YGFlexDirectionIsColumn(flexDirection)
        ? YGResolveFlexDirection(YGFlexDirection.Row, direction)
        : YGFlexDirection.Column;
}
export function YGFlexDirectionIsRow(flexDirection) {
    return flexDirection == YGFlexDirection.Row || flexDirection == YGFlexDirection.RowReverse;
}
export function YGResolveValue(value, ownerSize) {
    switch (value.unit) {
        case YGUnit.Point:
            return new YGFloatOptional(value.value);
        case YGUnit.Percent:
            return new YGFloatOptional(value.value * ownerSize * 0.01);
        default:
            return new YGFloatOptional();
    }
}
export function YGFlexDirectionIsColumn(flexDirection) {
    return flexDirection == YGFlexDirection.Column || flexDirection == YGFlexDirection.ColumnReverse;
}
export function YGResolveFlexDirection(flexDirection, direction) {
    if (direction == YGDirection.RTL) {
        if (flexDirection == YGFlexDirection.Row) {
            return YGFlexDirection.RowReverse;
        }
        else if (flexDirection == YGFlexDirection.RowReverse) {
            return YGFlexDirection.Row;
        }
    }
    return flexDirection;
}
export function YGResolveValueMargin(value, ownerSize) {
    return value.unit == YGUnit.Auto ? new YGFloatOptional(0) : YGResolveValue(value, ownerSize);
}
export function throwLogicalErrorWithMessage(message) {
    throw new Error(message);
}
export function cloneYGValueArray(array) {
    const ret = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        ret[i] = array[i].clone();
    }
    return ret;
}
//# sourceMappingURL=utils.js.map