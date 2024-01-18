'use strict';
import { EventEmitter } from 'node:events'
import chalk from 'chalk'
import deepmerge from '../misc/Deepmerge.mjs'
import stringWidth from '../text/lib/StringWidth.mjs'
import cliTruncate from '../text/lib/CliTruncate.mjs'
import ThemeManager from '../themes/ThemeManager.mjs'
import TextEmitter from '../text/TextEmitter.mjs'

export default class Box extends EventEmitter {

    constructor(boxWidth = process.stdout.columns || 79, boxHeight = process.stdout.rows || 3, boxOptions = {}) {

        super()

        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        const themeColors = ThemeManager.getThemeColors()
        const defaultsBox = {
            boxStyle: { borderStyle: 'round', color: 'default' },
            boxTitle: { text: '', options: { hAlign: 'center' } },
            boxContent: {
                renderOptions: { renderType: 'ansi', },
                colorOptions: { colorType: 'theme' },
                animationOptions: { animationType: 'none' },
                styleOptions: { vAlign: 'middle' }
            }
        }

        this.boxOptions = deepmerge(defaultsBox, boxOptions)

        const themedboxes = ThemeManager.getThemedBoxes()
        const boxColor = this.boxOptions.boxStyle.color + 'Box'
        if (Object.getOwnPropertyNames(themedboxes).includes(boxColor)) {
            this.box = themedboxes[boxColor]
        } else {
            this.box = themedboxes.box
        }
        this.themeColors = ThemeManager.getThemeColors()

        this.textEmitter = new TextEmitter(this.boxOptions.boxContent.renderOptions, this.boxOptions.boxContent.colorOptions, this.boxOptions.boxContent.animationOptions)
        this.textEmitter.on('frame', (rendered) => {
            const lineTop = this.#getLineTop()
            const lineBottom = this.#getLineBottom()
            let rows = []
            for (const row of Object.values(rendered)) {
                let rowLines = row.rendered
                rowLines = rowLines.map((row) => {
                    const padSize = (this.boxWidth - 2) - stringWidth(row)
                    row = row + ' '.repeat(padSize)
                    row = this.box.left + chalk.bgHex(this.themeColors.primary.background)(row) + this.box.right
                    return row
                })
                rows = [...rows, ...rowLines]
            }
            if (rows.length > (this.boxHeight - 2)) {
                rows.length = (this.boxHeight - 2)
            }
            const vAlign = this.boxOptions.boxContent.styleOptions.vAlign
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

    } // constructor

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

    render(text, maxOutputWidth = this.boxWidth - 2, maxOutputHeight = this.boxHeight - 2) {

        this.textEmitter.renderText(text, maxOutputWidth, maxOutputHeight)

    }

}


const input = 'The ελληνικά quick 字 🌷🎁💩 🏳️‍🌈\u001b[100m 😜👍brown 🏳️‍🌈 \u001b[49m\u001b[31mfox jumped 🏳️‍🌈 over \u001b[39mthe lazy \u001b[32mdog and 字 then\u001b[39m\u001b[101m ran away 🏳️‍🌈 with the🌷🎁💩unicorn. 💛 \u001b[49m'
// const input = 'The quick brown';
let box = new Box(process.stdout.columns - 5, process.stdout.rows - 5)
box.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/).length + 1
    console.log(boxrows, '\n')
})
const boxed = box.render(input)
