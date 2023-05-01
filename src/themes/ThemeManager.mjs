'use strict'
import path from 'node:path'

// These lines make "require" available
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import { fileURLToPath } from 'node:url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

import chalk from 'chalk'
import BorderCharacters from '../borders/Borders.mjs'

export default class ThemeManager {

    borderCharacters = {}

    /**
     * @param {string|object} value
     */
    set borderStyle(value) {

        const objectsHaveSameKeys = (...objects) => {
            const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
            const union = new Set(allKeys);
            return objects.every(object => union.size === Object.keys(object).length);
        }

        if (typeof value == 'string') {
            if (Object.keys(BorderCharacters).includes(value.toLowerCase())) {
                this.borderCharacters = BorderCharacters[value.toLowerCase()]
            } else {
                throw new TypeError(`borderStyle must be one of ${Object.keys(BorderCharacters).join(' or ')}`)
            }
        }
        if (typeof value == 'object') {
            if (objectsHaveSameKeys(value, BorderCharacters.single)) {
                this.borderCharacters = boxOptions.borderStyle
            } else {
                throw new TypeError(`borderStyle object must have ${Object.keys(BorderCharacters.single).join(',')} properties`)
            }
        }
    }

    constructor(themeName = 'Default.light', borderType = 'single') {
        const scheme = require(path.join(__dirname, 'data', themeName + '.json'))
        this.theme = this.#colorsToTheme(scheme.colors)
        this.colors = scheme.colors
        this.borderStyle = borderType
    }

    #colorsToTheme(colors) {

        // Destructure the colors for easy access
        const {
            primary: { background, foreground },
            normal: { red, green, blue, yellow, magenta, cyan },
        } = colors;

        const _colors = [red, green, blue, yellow, magenta, cyan];
        const colorNames = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'];

        const colorBoxes = _colors.map(c => {
            return {
                border: {
                    type: 'line',
                    fg: c,
                    bg: background,
                },
                style: {
                    fg: c,
                    bg: background,
                    label: {
                        fg: c,
                        bg: background,
                    }
                },
            };
        });

        const theme = {

            box: {
                border: {
                    type: 'line',
                    fg: foreground,
                    bg: background,
                },
                style: {
                    fg: foreground,
                    bg: background,
                    label: {
                        fg: foreground,
                        bg: background,
                    }
                },
            },
        };

        colorNames.forEach((c, index) => {
            const name = `${c}Box`;
            theme[name] = colorBoxes[index];
        });

        return theme;

    }

    getThemeColors() {

        return this.colors
        
    }

    getThemedBoxes(theme = this.theme, borderCharacters = this.borderCharacters) {

        const boxes = {};

        for (const [box, boxColors] of Object.entries(theme)) {
            const borders = JSON.parse(JSON.stringify(borderCharacters));
            for (const [charName, charValue] of Object.entries(borders)) {
                borders[charName] = chalk.bgHex(boxColors.border.bg).hex(boxColors.border.fg)(charValue);
                const repeat = (n) => { return chalk.bgHex(boxColors.border.bg).hex(boxColors.border.fg)(charValue.repeat(n)); };
                Object.defineProperty(borders, charName + 'Repeat', { value: repeat });
            }

            borders['padCharacter'] = chalk.bgHex(boxColors.border.bg).hex(boxColors.border.fg)(' ');
            const padCharacterRepeat = (n) => { return chalk.bgHex(boxColors.border.bg).hex(boxColors.border.fg)(borders['padCharacter'].repeat(n)); };
            Object.defineProperty(borders, 'padCharacterRepeat', { value: padCharacterRepeat });
            const colorizeStyle = (s) => { return chalk.bgHex(boxColors.style.bg).hex(boxColors.style.fg)(s); };
            Object.defineProperty(borders, 'colorizeStyle', { value: colorizeStyle });
            const colorizeLabel = (s) => { return chalk.bgHex(boxColors.style.label.bg).hex(boxColors.style.label.fg)(s); };
            Object.defineProperty(borders, 'colorizeLabel', { value: colorizeLabel });
            Object.defineProperty(boxes, box, { value: borders });

        }

        return boxes;
    }

}

