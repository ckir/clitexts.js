import { YGDirection, YGFlexDirection, YGPositionType, YGJustify, YGAlign, YGWrap, YGOverflow, YGDisplay } from './enums.js';
import { YGValue } from './ygvalue.js';
import { YGFloatOptional } from './ygfloatoptional.js';
declare class YGStyle {
    direction: YGDirection;
    flexDirection: YGFlexDirection;
    justifyContent: YGJustify;
    alignContent: YGAlign;
    alignItems: YGAlign;
    alignSelf: YGAlign;
    positionType: YGPositionType;
    flexWrap: YGWrap;
    overflow: YGOverflow;
    display: YGDisplay;
    flex: YGFloatOptional;
    flexGrow: YGFloatOptional;
    flexShrink: YGFloatOptional;
    flexBasis: YGValue;
    margin: Array<YGValue>;
    position: Array<YGValue>;
    padding: Array<YGValue>;
    border: Array<YGValue>;
    dimensions: [YGValue, YGValue];
    minDimensions: [YGValue, YGValue];
    maxDimensions: [YGValue, YGValue];
    aspectRatio: YGFloatOptional;
    constructor();
    isEqual(style: YGStyle): boolean;
    isDiff(style: YGStyle): boolean;
    clone(): YGStyle;
}
export { YGStyle };
