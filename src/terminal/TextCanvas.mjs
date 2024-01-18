import { EventEmitter } from 'node:events'
import sliceAnsi from '../text/lib/AnsiSlice.mjs'
import stringWidth from '../text/lib/StringWidth.mjs'
import Viewport from './Viewport.mjs'

import stripAnsi from '../text/lib/AnsiStrip.mjs'

export default class TextCanvas extends EventEmitter {

    #viewport
    #viewportDimensions
    #buffer

    #defaults = {
        cleanValue: ' '
    }

    constructor(canvasColumns = process.stdout.columns, canvasRows = process.stdout.rows, canvasOptions = {}) {

        super()
        this.options = { ...this.#defaults, ...canvasOptions }
        this.#buffer = this.#buildBuffer(canvasRows, canvasColumns, this.options.cleanValue)
        this.#viewport = new Viewport(canvasColumns, canvasRows)
        this.#viewportDimensions = this.#viewport.getCurrentViewport()
        this.#viewport.on('viewportChange', (dimensions) => {
            this.#viewportDimensions = dimensions
            this.renderViewport(this.#viewportDimensions.y, this.#viewportDimensions.x, this.#viewportDimensions.width, this.#viewportDimensions.height)
        })
        this.renderViewport(this.#viewportDimensions.y, this.#viewportDimensions.x, this.#viewportDimensions.width, this.#viewportDimensions.height)

    }

    #buildBuffer(rows, columns, cleanValue) {
        const buffer = [];
        let row;
        for (let i = 0; i < rows; i++) {
            if (typeof cleanValue == 'function') {
                row = cleanValue(columns)
            }
            else {
                row = cleanValue.repeat(columns)
            }
            buffer.push(row);
        }
        return buffer
    }

    #select(row, col, width, height) {
        const selection = []
        let i = 0
        for (i = row; i < Math.min((row + height), this.#buffer.length); i++) {
            const row = this.#buffer[i]
            const slice = sliceAnsi(row, col, Math.min(col + width, row.length))
            selection.push(slice)
        }
        return selection
    }

    renderViewport(row, col, width, height) {
        const viewportRows = this.#select(row, col, width, height)
        this.#viewport.contentRows = viewportRows
    }

    draw(y, x, rows) {
        let i = 0
        for (i = 0; i < rows.length; i++) {
            let row = rows[i]
            let rowWidth = stringWidth(row)
            let canvasRow = this.#buffer[y + i]
            let canvasRowWidth = stringWidth(canvasRow)
            canvasRow = sliceAnsi(canvasRow, 0, x) + rows[i] + sliceAnsi(canvasRow, x + rowWidth, canvasRowWidth)
            this.#buffer[y + i] = canvasRow
        }
        this.toText(this.#buffer)
        this.renderViewport(this.#viewportDimensions.y, this.#viewportDimensions.x, this.#viewportDimensions.width, this.#viewportDimensions.height)
    }

    toText(rows) {
        const textRows = []
        rows.forEach(row => {
            row = stripAnsi(row)
            textRows.push(row)
        })
        return textRows
    }

}

// const textCanvas = new TextCanvas(640, 480)