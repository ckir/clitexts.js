export declare enum AspectRatioMode {
    IGNORE = 0,
    KEEP = 1,
    KEEP_BY_EXPANDING = 2,
    KEEP_NO_ENLARGE = 3
}
export declare enum AlignVert {
    IGNORE = 0,
    TOP = 16,
    BOTTOM = 32,
    CENTER = 64
}
export declare enum AlignHorz {
    IGNORE = 0,
    LEFT = 1,
    RIGHT = 2,
    CENTER = 4
}
export declare enum ScaleMode {
    FIT = 0,
    FILL = 1,
    CENTER = 2,
    STRETCH_TO_FILL = 3,
    FIT_NO_ENLARGE = 4
}
interface Vec2 {
    x: number;
    y: number;
}
export default class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    set(x?: number, y?: number, width?: number, height?: number): this;
    setFromVec2(vec: Vec2, width?: number, height?: number): this;
    setFromRect(rect: Rectangle): this;
    setFromCorners(topLeft: Vec2, bottomRight: Vec2): this;
    get position(): Vec2;
    set position(position: Vec2);
    get size(): Vec2;
    set size(vec: Vec2);
    setFromCenter(x: number, y: number, w: number, h: number): this;
    setFromCenterVec2(vec: Vec2, w: number, h: number): this;
    translate(dx: number, dy: number): this;
    translateVec2(vec: Vec2): this;
    translateX(x: number): this;
    translateY(y: number): this;
    scale(scale: number): this;
    scaleXY(x: number, y: number): this;
    scaleVec2(vec: Vec2): this;
    scaleWidth(x: number): this;
    scaleHeight(y: number): this;
    scaleFromCenter(scale: number): this;
    scaleFromCenterXY(x: number, y: number): this;
    scaleFromCenterVec2(vec: Vec2): this;
    scaleToAspect(targetRect: Rectangle, subjectAspectRatioMode: AspectRatioMode): this;
    scaleToAspect(targetRect: Rectangle, subjectAspectRatioMode: AspectRatioMode, sharedHorzAnchor: AlignHorz): this;
    scaleToAspect(targetRect: Rectangle, subjectAspectRatioMode: AspectRatioMode, sharedHorzAnchor: AlignHorz, sharedVertAnchor: AlignVert): this;
    scaleToAspect(targetRect: Rectangle, aspectRatioMode: AspectRatioMode, modelHorzAnchor: AlignHorz, modelVertAnchor: AlignVert, thisHorzAnchor: AlignHorz, thisVertAnchor: AlignVert): this;
    scaleTo(targetRect: Rectangle, scaleMode?: ScaleMode): this;
    alignToHorz(targetX: number, thisHorzAnchor?: AlignHorz): this;
    alignToHorzRect(targetRect: Rectangle): this;
    alignToHorzRect(targetRect: Rectangle, sharedAnchor: AlignHorz): this;
    alignToHorzRect(targetRect: Rectangle, targetHorzAnchor: AlignHorz, thisHorzAnchor: AlignHorz): this;
    alignToVert(targetY: number, thisVertAnchor?: AlignVert): this;
    alignToVertRect(targetRect: Rectangle): this;
    alignToVertRect(targetRect: Rectangle, sharedAnchor: AlignVert): this;
    alignToVertRect(targetRect: Rectangle, targetVertAnchor: AlignVert, thisVertAnchor: AlignVert): this;
    alignToVec2(targetPoint: Vec2, thisHorzAnchor: AlignHorz, thisVertAnchor: AlignVert): this;
    alignToRect(targetRect: Rectangle): this;
    alignToRect(targetRect: Rectangle, sharedHorzAnchor: AlignHorz): this;
    alignToRect(targetRect: Rectangle, sharedHorzAnchor: AlignHorz, sharedVertAnchor: AlignVert): this;
    alignToRect(targetRect: Rectangle, targetHorzAnchor: AlignHorz, targetVertAnchor: AlignVert, thisHorzAnchor: AlignHorz, thisVertAnchor: AlignVert): this;
    insideXY(x: number, y: number): boolean;
    insideVec2(vec: Vec2): boolean;
    insideRect(rect: Rectangle): boolean;
    insideLine(vec1: Vec2, vec2: Vec2): boolean;
    growToIncludeXY(x: number, y: number): this;
    growToIncludeVec2(vec: Vec2): this;
    growToIncludeRect(rect: Rectangle): this;
    growToIncludeLine(vec1: Vec2, vec2: Vec2): this;
    getIntersectionRect(rect: Rectangle): Rectangle;
    getUnionRect(rect: Rectangle): Rectangle;
    standardize(): this;
    get isStandardized(): boolean;
    get area(): number;
    get perimeter(): number;
    get aspectRatio(): number;
    get isEmpty(): boolean;
    get min(): Vec2;
    get max(): Vec2;
    get minX(): number;
    get maxX(): number;
    get minY(): number;
    get maxY(): number;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    get topLeft(): Vec2;
    get topRight(): Vec2;
    get bottomLeft(): Vec2;
    get bottomRight(): Vec2;
    get center(): Vec2;
    getHorzAnchor(anchor: AlignHorz): number;
    getVertAnchor(anchor: AlignVert): number;
    notEquals(rect: Rectangle): boolean;
    equals(rect: Rectangle): boolean;
    addVec2(vec: Vec2): this;
    subVec2(vec: Vec2): this;
}
export {};
