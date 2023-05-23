export declare class Terminal {
    static moveX(x: number): string;
    static moveY(y: number): string;
    static moveRelative(x: number, y: number): string;
    static move(x: number, y: number): string;
    static clearScreen(): string;
    static eraseLine(): string;
    static fg(index: number): string;
    static bg(index: number): string;
    static noColor(): string;
    static scrollUp(top: number, bottom: number, rows: number): string;
    static scrollDown(top: number, bottom: number, rows: number): string;
}
