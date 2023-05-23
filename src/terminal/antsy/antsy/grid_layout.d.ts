import { Region } from "./canvas.js";
export interface Constraint {
    minimum: number;
    maximum?: number;
    factor: number;
}
export declare class GridLayout {
    region: Region;
    colConstraints: Constraint[];
    rowConstraints: Constraint[];
    lefts: number[];
    tops: number[];
    resizeListeners: Set<() => void>;
    onResize: () => void;
    constructor(region: Region, colConstraints: Constraint[], rowConstraints: Constraint[]);
    static fixed(cells: number): Constraint;
    static stretch(factor: number): Constraint;
    static stretchWithMinimum(factor: number, minimum: number): Constraint;
    static stretchWithMinMax(factor: number, minimum: number, maximum: number): Constraint;
    detach(): void;
    update(colConstraints: Constraint[], rowConstraints: Constraint[]): void;
    adjustCol(x: number, c: Constraint): void;
    adjustRow(y: number, c: Constraint): void;
    layout(x1: number, y1: number, x2: number, y2: number): Region;
    layoutAt(x1: number, y1: number): Region;
    resize(cols: number, rows: number): void;
    static solveConstraints(constraints: Constraint[], size: number): number[];
}
