export declare class ScrollRegion {
    top: number;
    bottom: number;
    rows: number;
    attr: number;
    constructor(top: number, bottom: number, rows: number, attr: number);
}
export declare class TextBuffer {
    cols: number;
    rows: number;
    chars: Uint32Array;
    attrs: Uint16Array;
    dirty: Uint8Array;
    pendingClear?: number;
    pendingScrolls: ScrollRegion[];
    cursorX: number;
    cursorY: number;
    attr: number;
    constructor(cols: number, rows: number);
    resize(cols: number, rows: number, defaultAttr: number): void;
    private alloc;
    put(x: number, y: number, attr: number, char: number): void;
    getAttr(x: number, y: number): number;
    getBackground(x: number, y: number): number;
    getChar(x: number, y: number): number;
    set(other: TextBuffer): void;
    setSpan(x: number, y: number, x2: number, other: TextBuffer): void;
    isBlank(x: number, y: number): number | undefined;
    isSame(x: number, y: number, other: TextBuffer, othery?: number): boolean;
    copySegment(xdest: number, ydest: number, xsource: number, ysource: number, count: number): void;
    clearSegment(x1: number, x2: number, y: number, attr: number): void;
    clearToEndOfLine(x: number, y: number, attr: number): void;
    setDirty(y: number): void;
    isDirty(y: number): boolean;
    copyBox(x1: number, y1: number, x2: number, y2: number, cols: number, rows: number): void;
    putBox(x1: number, y1: number, other: TextBuffer, ox1: number, oy1: number, ox2: number, oy2: number): void;
    clearBox(x1: number, y1: number, x2: number, y2: number, attr: number): void;
    scrollUp(x1: number, y1: number, x2: number, y2: number, rows: number, attr: number): void;
    scrollDown(x1: number, y1: number, x2: number, y2: number, rows: number, attr: number): void;
    scrollLeft(x1: number, y1: number, x2: number, y2: number, cols: number, attr: number): void;
    scrollRight(x1: number, y1: number, x2: number, y2: number, cols: number, attr: number): void;
    clearDirty(): void;
    setAllDirty(): void;
    transform(f: (fg: number, bg: number, char: number, x: number, y: number) => number[]): void;
}
