'use strict';
import { EventEmitter } from 'node:events'
import chalk from 'chalk'
import deepmerge from '../misc/Deepmerge.mjs'
import stringWidth from '../text/StringWidth.mjs'
import cliTruncate from '../text/CliTruncate.mjs'
import ThemeManager from '../themes/ThemeManager.mjs'
import TextEmitter from '../text/TextEmitter.mjs'


export default class Box extends EventEmitter {

    #defaultsBox = {
        boxStyle: { borderStyle: 'round', color: 'green' },
        boxTitle: { text: '', options: { hAlign: 'center' } },
        boxContent: { renderOptions: { type: 'cfonts', options: {} }, colorOptions: { type: 'none', options: {} }, options: { vAlign: 'middle' } }
    }

    constructor(boxWidth = process.stdout.columns || 79, boxHeight = process.stdout.rows || 3, boxOptions = {}) {

        super()
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.boxOptions = deepmerge(this.#defaultsBox, boxOptions)

        // const themeManager = new ThemeManager(this.boxOptions.boxStyle.themeName, this.boxOptions.boxStyle.borderStyle)
        const themedboxes = ThemeManager.getThemedBoxes()
        const boxColor = this.boxOptions.boxStyle.color + 'Box'
        if (Object.getOwnPropertyNames(themedboxes).includes(boxColor)) {
            this.box = themedboxes[boxColor]
        } else {
            this.box = themedboxes.box
        }
        this.themeColors = ThemeManager.getThemeColors()

        this.textEmitter = new TextEmitter(this.boxOptions.boxContent.renderOptions, this.boxOptions.boxContent.colorOptions)
        this.textEmitter.on('text', (rendered) => {
            const lineTop = this.#getLineTop()
            const lineBottom = this.#getLineBottom()
            let rows = []
            for (const line of rendered) {
                let lineRows = line.split('\n')
                lineRows = lineRows.map((row) => {
                    row = this.box.left + chalk.bgHex(this.themeColors.primary.background)(row) + this.box.right
                    return row
                })
                rows = [...rows, ...lineRows]
            }
            if (rows.length > (this.boxHeight - 2)) {
                rows.length = (this.boxHeight - 2)
            }
            const vAlign = this.boxOptions.boxContent.options.vAlign
            switch (vAlign) {
                case 'bottom':
                    for (let index = rows.length; index < (this.boxHeight - 2); index++) {
                        rows.unshift(this.box.left + this.box.padCharacterRepeat(this.boxWidth - 2) + this.box.right)
                    }
                    break;

                case 'middle':
                    let pad = Math.floor((this.boxHeight - rows.length - 2) / 2)
                    for (let index = 0; index < pad; index++) {
                        rows.unshift(this.box.left + this.box.padCharacterRepeat(this.boxWidth - 2) + this.box.right)
                    }
                    pad = pad + (((this.boxHeight - 2) % 2 === 1) ? 1 : 0)
                    for (let index = 0; index < pad; index++) {
                        rows.push(this.box.left + this.box.padCharacterRepeat(this.boxWidth - 2) + this.box.right)
                    }
                    break;

                default: // 'top'
                    for (let index = rows.length; index < (this.boxHeight - 2); index++) {
                        rows.push(this.box.left + this.box.padCharacterRepeat(this.boxWidth - 2) + this.box.right)
                    }
                    break;
            }
            rows.unshift(lineTop)
            rows.push(lineBottom)
            this.emit('box', rows.join('\n'))

        })


    }

    #getLineTop(box = this.box, titleText = this.boxOptions.boxTitle.text, hAlign = this.boxOptions.boxTitle.options.hAlign, lineWidth = this.boxWidth) {

        if (!titleText) {
            return box.topLeft + box.horizontalRepeat(lineWidth - 2) + box.topRight
        }

        let titleWidth = stringWidth(titleText)
        if (titleWidth > (lineWidth - 7)) {
            titleText = cliTruncate(titleText, lineWidth - 7)

        }
        titleText = box.rightIntersect + titleText + box.leftIntersect
        titleWidth = stringWidth(titleText)

        switch (hAlign) {
            case 'center':
                return box.topLeft + box.topRepeat(Math.floor((lineWidth - titleWidth - 2) / 2)) + titleText + box.topRepeat(Math.floor((lineWidth - titleWidth - 2) / 2) + ((lineWidth % 2 === 1) ? 0 : 1)) + box.topRight
            case 'right':
                return box.topLeft + box.topRepeat(lineWidth - titleWidth - 2) + titleText + box.topRight
            default: // left
                return box.topLeft + titleText + box.topRepeat(lineWidth - titleWidth - 2) + box.topRight
        }

    }

    #getLineBottom(box = this.box, lineWidth = this.boxWidth) {

        return box.bottomLeft + box.horizontalRepeat(lineWidth - 2) + box.bottomRight

    }

    render(text, maxOutputWidth = this.boxWidth - 2) {

        this.textEmitter.renderText(text, maxOutputWidth)

    }


}

// import cliCursor from '../terminal/CliCursor.mjs'
// const input = 'The quick brown ' + chalk.red('fox jumped over ') +
//     'the lazy ' + chalk.green('dog and then ran away with the unicorn. ');
// const input = 'The quick brown';
// let box = new Box(80, 20)
// box.on('box', (boxrows) => {
//     const rows = boxrows.split(/\r\n|\r|\n/).length + 1
//     console.log(boxrows, '\n')
// })
// box.render(input)
