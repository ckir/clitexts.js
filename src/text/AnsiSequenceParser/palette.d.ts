import { Color, ColorName } from './colors.js';
export declare const defaultNamedColorsMap: {
    readonly black: "#000000";
    readonly red: "#bb0000";
    readonly green: "#00bb00";
    readonly yellow: "#bbbb00";
    readonly blue: "#0000bb";
    readonly magenta: "#ff00ff";
    readonly cyan: "#00bbbb";
    readonly white: "#eeeeee";
    readonly brightBlack: "#555555";
    readonly brightRed: "#ff5555";
    readonly brightGreen: "#00ff00";
    readonly brightYellow: "#ffff55";
    readonly brightBlue: "#5555ff";
    readonly brightMagenta: "#ff55ff";
    readonly brightCyan: "#55ffff";
    readonly brightWhite: "#ffffff";
};
export declare function createColorPalette(namedColorsMap?: Record<ColorName, string>): {
    value: (color: Color) => string;
};
