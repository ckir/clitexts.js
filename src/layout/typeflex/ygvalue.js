// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGValue.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGValue.cpp
import { YGUnit } from './enums.js';
export const YGUndefined = undefined;
export const YGValueZero = () => new YGValue(0, YGUnit.Point);
export const YGValueUndefined = () => new YGValue(YGUndefined, YGUnit.Undefined);
export const YGValueAuto = () => new YGValue(YGUndefined, YGUnit.Auto);
export class YGValue {
    value;
    unit;
    constructor(value, unit) {
        this.value = value;
        this.unit = unit;
    }
    eq(value) {
        const lhs = this;
        const rhs = value;
        if (lhs.unit != rhs.unit) {
            return false;
        }
        switch (lhs.unit) {
            case YGUnit.Undefined:
            case YGUnit.Auto:
                return true;
            case YGUnit.Point:
            case YGUnit.Percent:
                return lhs.value == rhs.value;
        }
        return false;
    }
    neq(value) {
        return !this.eq(value);
    }
    subtract(value) {
        return new YGValue(-value.value, value.unit);
    }
    clone() {
        return new YGValue(this.value, this.unit);
    }
    // deviation: upstream this is only provided in CompactValue.
    isUndefined() {
        return this.unit == YGUnit.Undefined;
    }
}
//# sourceMappingURL=ygvalue.js.map