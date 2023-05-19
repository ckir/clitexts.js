'use strict'
import { EventEmitter } from 'node:events'
import wrapAnsi from '../text/AnsiWrap.mjs'
import sliceAnsi from '../text/AnsiSlice.mjs'
import fixedWidthString from '../text/AnsiFixedWidthString.mjs'


function normalizeSize (size, max) {
    if (Number.isFinite(size) || size === 'auto') {
      // we'll deal with 'auto' when we have normalized everything else
      return size
    } else if (typeof size === 'string') {
      const isPct = size.indexOf('%') !== -1
      return isPct
        ? Math.round(parseInt(size, 10) / 100 * max)
        : parseInt(size, 10)
    } else {
      throw new Error('Unexpected size: ' + size)
    }
  }
  
  function normalizePadding (p) {
    // use same normalization rules as for CSS
    if (!p) p = [0, 0, 0, 0]
    else if (!Array.isArray(p)) p = [p, p, p, p]
    switch (p.length) {
      case 0:
        p = [0, 0, 0, 0]
        break
      case 1:
        p = [p[0], p[0], p[0], p[0]]
        break
      case 2:
        p = [p[0], p[1], p[0], p[1]]
        break
      case 3:
        p = [p[0], p[1], p[2], p[1]]
        break
      case 4:
        break
      default:
        p = p.slice(0, 4)
    }
    return p
  }
  
  function calcRemainingWidth (cells, viewportWidth) {
    const fixedWidth = cells.reduce(function (total, cell) {
      return total + (cell.width || 0)
    }, 0)
    return viewportWidth - fixedWidth
  }
  
  function renderCellLines (cell) {
    const topPad = cell.padding[0]
    const rightPad = cell.padding[1]
    const bottomPad = cell.padding[2]
    const leftPad = cell.padding[3]
    const textWidth = cell.width - leftPad - rightPad
    const textHeight = cell.height - topPad - bottomPad
    let text = cell.text
    if (cell.wrap) text = wrapAnsi(text, textWidth)
    let lines = text.split('\n').slice(0, textHeight)
    if (leftPad) {
      const padding = Array(leftPad + 1).join(' ')
      lines = lines.map(function (line) {
        return padding + line
      })
    }
    if (topPad) lines = Array(topPad).fill('').concat(lines)
    if (cell.wrap) {
      return lines.map(function (line) {
        return fixedWidthString(line, cell.width)
      })
    } else {
      return lines.map(function (line) {
        return fixedWidthString(sliceAnsi(line, 0, textWidth), cell.width)
      })
    }
  }
  
  function rowHeight (row) {
    return row.cells.reduce(function (height, cell) {
      return cell.height > height ? cell.height : height
    }, 0)
  }
  
  function calcX (row, cell) {
    let x = 0
    while (--cell >= 0) x += row.cells[cell].width
    return x
  }
  
  function calcY (rows, row) {
    let y = 0
    while (--row >= 0) y += rows[row].height
    return y
  }
  

export default class Grid extends EventEmitter {

    constructor(opts) {

        super()

        const rows = Array.isArray(opts) ? opts : opts.rows
        this._rows = rows.map(function (row) {
            if (Array.isArray(row)) row = { cells: row }
            row.cells = row.cells.map(function (cell) {
                if (typeof cell === 'string') cell = { text: cell }
                return {
                    _width: cell.width || 'auto',
                    _height: cell.height || 'auto',
                    text: cell.text || '',
                    wrap: cell.wrap !== false,
                    padding: normalizePadding(cell.padding)
                }
            })
            return row
        })

        this.resize(
            opts.width || process.stdout.columns,
            opts.height || process.stdout.rows
        )
    }

    toString() {
        return this._rows.reduce(function (str, row) {
            for (let line = 0; line < row.height; line++) {
                str = row.cells.reduce(function (str, cell) {
                    return str + (line >= cell.lines.length
                        ? cell.whitespace
                        : cell.lines[line])
                }, str) + '\n'
            }
            return str
        }, '').slice(0, -1) // drop last line break
    }

    update(row, col, text) {
        const cell = this._rows[row].cells[col]
        cell.text = text
        cell.lines = renderCellLines(cell)
        this.emit('update')
    }

    resize(viewportWidth, viewportHeight) {
        const autoHeightRows = []
        let fixedHeight = 0

        this._rows.forEach(function (row) {
            const autoWidthCells = []
            let autoHeight = false

            // calculate cell dimentions for cells with fixed sizes
            row.cells.forEach(function (cell) {
                // in case we're resizing, reset the previously calculated dimentions
                cell.width = null
                cell.height = null

                if (cell._width === 'auto') autoWidthCells.push(cell)
                else cell.width = normalizeSize(cell._width, viewportWidth)
                if (cell._height === 'auto') autoHeight = true
                else cell.height = normalizeSize(cell._height, viewportHeight)
            })

            // calculate width for cells with 'auto' width
            if (autoWidthCells.length > 0) {
                const remainingWidth = calcRemainingWidth(row.cells, viewportWidth)
                const autoWidth = Math.floor(remainingWidth / autoWidthCells.length)
                let cell
                for (let i = 0; i < autoWidthCells.length; i++) {
                    cell = autoWidthCells[i]
                    cell.width = autoWidth
                }
                cell.width += remainingWidth % autoWidthCells.length
            }

            if (autoHeight) {
                autoHeightRows.push(row)
            } else {
                // populate row height if not 'auto'
                row.height = rowHeight(row)
                fixedHeight += row.height
            }
        })

        // calculate height for rows with 'auto' height
        if (autoHeightRows.length > 0) {
            const remainingHeight = viewportHeight - fixedHeight
            const autoHeight = Math.floor(remainingHeight / autoHeightRows.length)

            // set height on rows that are 'auto'
            let row
            for (let i = 0; i < autoHeightRows.length; i++) {
                row = autoHeightRows[i]
                row.height = autoHeight
            }
            row.height += remainingHeight % autoHeightRows.length

            // inherit row height on all calls that are 'auto'
            autoHeightRows.forEach(function (row) {
                row.cells.forEach(function (cell) {
                    cell.height = cell.height || row.height
                })
            })
        }

        // populate remaining cell properties
        const self = this
        this._rows.forEach(function (row, index) {
            const y = calcY(self._rows, index)
            row.cells.forEach(function (cell, index) {
                cell.whitespace = Array(cell.width + 1).join(' ')
                cell.lines = renderCellLines(cell)
                cell.x = calcX(row, index)
                cell.y = y
            })
        })
    }

    cellAt(row, index) {
        const cell = this._rows[row].cells[index]
        return {
            text: cell.text,
            wrap: cell.wrap,
            width: cell.width,
            height: cell.height,
            padding: cell.padding,
            x: cell.x,
            y: cell.y
        }
    }
}

// const grid = new Grid({
//     height: 10,
//     width: 20,
//     rows: [
//       [{height: 5, text: 'This is the top cell spanning the entire width'}],
//       [{width: '50%', text: 'Left column'}, {width: '50%', text: 'Right column'}]
//     ]
//   })
  
//   // Update the text in cell C
//   grid.update(1, 1, 'This text have been overwritten')
  
//   console.log(grid.toString())

// This is the top cell
// spanning the entire
// width


// Left      This text
// column    have been
//           overwritt…
