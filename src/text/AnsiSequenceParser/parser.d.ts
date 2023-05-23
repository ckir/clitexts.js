import { Color } from './colors.js';
import { DecorationType } from './decorations.js';
export interface ParseToken {
    value: string;
    foreground: Color | null;
    background: Color | null;
    decorations: Set<DecorationType>;
}
export declare function createAnsiSequenceParser(): {
    parse(value: string): ParseToken[];
};
export declare function parseAnsiSequences(value: string): ParseToken[];
