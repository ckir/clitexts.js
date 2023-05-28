import { YGDirection } from './enums.js';
import { YGFloatOptional } from './ygfloatoptional.js';
import { YGCachedMeasurement } from './internal.js';
declare class YGLayout {
    position: [number, number, number, number];
    dimensions: [number, number];
    margin: [number, number, number, number, number, number];
    border: [number, number, number, number, number, number];
    padding: [number, number, number, number, number, number];
    direction: YGDirection;
    computedFlexBasisGeneration: number;
    computedFlexBasis: YGFloatOptional;
    hadOverflow: boolean;
    generationCount: number;
    lastOwnerDirection: YGDirection;
    nextCachedMeasurementsIndex: number;
    cachedMeasurements: Array<YGCachedMeasurement>;
    measuredDimensions: Array<number>;
    cachedLayout: YGCachedMeasurement;
    didUseLegacyFlag: boolean;
    doesLegacyStretchFlagAffectsLayout: boolean;
    constructor();
    getDirection(): YGDirection;
    setDirection(direction: YGDirection): void;
    getDidUseLegacyFlag(): boolean;
    setDidUseLegacyFlag(val: boolean): void;
    getDoesLegacyStretchFlagAffectsLayout(): boolean;
    setDoesLegacyStretchFlagAffectsLayout(val: boolean): void;
    getHadOverflow(): boolean;
    setHadOverflow(hadOverflow: boolean): void;
    equal(layout: YGLayout): boolean;
    diff(layout: YGLayout): boolean;
    clean(): void;
    clone(): YGLayout;
}
export { YGLayout };
