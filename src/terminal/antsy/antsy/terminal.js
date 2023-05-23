// fancy CSI codes for updating a VT100/xterm terminal
const CSI = "\u001b[";
/*
 * a collection of static methods for generating the ANSI/xterm codes for
 * doing simple operations like moving the cursor, clearing the screen or
 * line, changing color, and scrolling.
 */
export class Terminal {
    static moveX(x) {
        if (x == 0)
            return "";
        if (x > 0) {
            return (x == 1) ? `${CSI}C` : `${CSI}${x}C`;
        }
        else {
            return (x == -1) ? `${CSI}D` : `${CSI}${-x}D`;
        }
    }
    static moveY(y) {
        if (y == 0)
            return "";
        if (y > 0) {
            return (y == 1) ? `${CSI}B` : `${CSI}${y}B`;
        }
        else {
            return (y == -1) ? `${CSI}A` : `${CSI}${-y}A`;
        }
    }
    static moveRelative(x, y) {
        return Terminal.moveX(x) + Terminal.moveY(y);
    }
    static move(x, y) {
        if (x == 0) {
            if (y == 0)
                return `${CSI}H`;
            return `${CSI}${y + 1}H`;
        }
        return `${CSI}${y + 1};${x + 1}H`;
    }
    static clearScreen() { return `${CSI}2J${CSI}H`; }
    static eraseLine() { return `${CSI}K`; }
    static fg(index) {
        if (index < 8)
            return `${CSI}3${index}m`;
        return `${CSI}38;5;${index}m`;
    }
    static bg(index) {
        if (index < 8)
            return `${CSI}4${index}m`;
        return `${CSI}48;5;${index}m`;
    }
    static noColor() {
        return `${CSI}m`;
    }
    // note: most terminals will scramble cursor location after scrolling
    static scrollUp(top, bottom, rows) {
        return `${CSI}${top + 1};${bottom}r${CSI}${rows}S${CSI}r`;
    }
    // note: most terminals will scramble cursor location after scrolling
    static scrollDown(top, bottom, rows) {
        return `${CSI}${top + 1};${bottom}r${CSI}${rows}T${CSI}r`;
    }
}
//# sourceMappingURL=terminal.js.map