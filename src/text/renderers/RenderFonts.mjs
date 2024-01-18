import os from 'node:os'
import fs from 'node:fs'
import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

import { createCanvas } from 'canvas'
import opentype from 'opentype.js'


class RenderFonts {

    static #_defaultFontsFolderPath = path.resolve(__dirname + path.join('fonts', 'regular'))
    static #_loadedFonts = {}
    static #_fontSizes = {}
    static #_canvas = createCanvas(1920, 100)
    static #_ctx = RenderFonts.#_canvas.getContext('2d')

    static #_loadFont(fontRealpath) {
        const isFileNameOnly = path.basename(fontRealpath) === fontRealpath
        fontRealpath = (isFileNameOnly) ? path.join(RenderFonts.#_defaultFontsFolderPath, fontRealpath) : fontRealpath
        if (!RenderFonts.#_loadedFonts[fontRealpath]) RenderFonts.#_loadedFonts[fontRealpath] = opentype.loadSync(fontRealpath)
        if (!RenderFonts.#_loadedFonts[fontRealpath].supported) {
            throw new ValueError(`${fontRealpath}: Font not supported`)
        }
        return RenderFonts.#_loadedFonts[fontRealpath]
    }

    static _drawLine(fontRealpath, fontSize, text) {

        const applyStyles = () => {
            RenderFonts.#_ctx.patternQuality = 'best' // 'fast'|'good'|'best'|'nearest'|'bilinear'
            RenderFonts.#_ctx.quality = 'best'        // 'fast'|'good'|'best'|'nearest'|'bilinear'
            RenderFonts.#_ctx.antialias = 'gray'      // 'default'|'none'|'gray'|'subpixel'
        }

        const toBitmapString = (canvas, ch = '#', removeEmptyLines = true, trim = true) => { // "█"
            let imageData
            try {
                imageData = Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data)
            } catch (error) {
                console.log(error)
            }

            let rows = []
            do {
                let rowImageData = imageData.splice(0, canvas.width * 4)
                let rowBinary = ''
                do {
                    let pixel = rowImageData.splice(0, 4)
                    rowBinary = rowBinary + (pixel.reduce((partial_sum, a) => partial_sum + a, 0) ? ch : ' ')
                } while (rowImageData.length != 0)
                rows.push(rowBinary)
            } while (imageData.length != 0)
            if (removeEmptyLines) rows = rows.filter(entry => /\S/.test(entry))
            if (trim) {
                rows = rows.map((row) => { return row.trimEnd() })
                let longest = rows.reduce((a, b) => a.length > b.length ? a : b, '').length
                rows = rows.map((row) => { return row.padEnd(longest, ' ') })
            }
            return rows.join(os.EOL)
        }

        const font = RenderFonts.#_loadFont(fontRealpath)
        const rowWidth = font.getAdvanceWidth(text, fontSize)
        RenderFonts.#_ctx.canvas.width = rowWidth
        RenderFonts.#_ctx.clearRect(0, 0, RenderFonts.#_ctx.canvas.width, RenderFonts.#_ctx.canvas.height)
        applyStyles()
        const path = font.getPath(text, 0, 60, fontSize)
        font.draw(RenderFonts.#_ctx, text, 0, 60, fontSize)
        const lines = toBitmapString(RenderFonts.#_canvas)
        // console.log(fontRealpath, lines.split(os.EOL).length)
        // console.log(lines)
        return lines

    }

    static render(text, maxOutputWidth, maxOutputHeight, style = {}) {

        const defaults = {
            fontFile: path.join(RenderFonts.#_defaultFontsFolderPath, 'Acme 9 Regular Xtnd.ttf'),
            wordWrap: 'letter', // 'none' | 'word' | 'letter' | 'oneline'
            textAlign: 'left', // 'left' | 'center' | 'right
            textScale: 'width' // 'height' | 'width'
        }
        style = { ...defaults, ...style }

        let rows = []

        const getFontSizeForHeight = (fontRealpath, maxOutputHeight) => {

            let text = 'jqWM'

            if ((fontRealpath in RenderFonts.#_fontSizes) && (maxOutputHeight in RenderFonts.#_fontSizes[fontRealpath])) return RenderFonts.#_fontSizes[fontRealpath][maxOutputHeight]
            // Converts returns in spaces, removes double spaces
            // text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            let fontSize = maxOutputHeight + 1
            let outputHeight = 0
            let lines = ''
            do {
                fontSize--
                lines = RenderFonts._drawLine(fontRealpath, fontSize, text)
                outputHeight = lines.split(os.EOL).length
            } while (outputHeight >= maxOutputHeight)
            RenderFonts.#_fontSizes[fontRealpath] = { [maxOutputHeight]: fontSize }
            return fontSize

        } // getFontSizeForHeight

        const getFontSizeForWidth = (text, font, maxOutputWidth) => {

            let fontSize = 15 //Math.ceil(maxOutputWidth / 3)
            let lineWidth = 0
            do {
                fontSize--
                if (fontSize < 9) break // Nothing renders well bellow 8px
                lineWidth = font.getAdvanceWidth(text, fontSize) // This corresponds to canvas2dContext.measureText(text).width
            } while (lineWidth > maxOutputWidth)
            return fontSize

        } // getFontSizeForWidth

        const formatLines = (rows, style, maxOutputWidth) => {

            Object.values(rows).forEach((row, index) => {

                let lines = row.rendered

                // Apply style
                if (style.textAlign == 'center') {
                    const trimmed = lines.map(line => line.trimEnd())
                    const longest = trimmed.reduce((a, b) => a.length > b.length ? a : b, '').length
                    const pad = (maxOutputWidth - longest) / 2
                    if (pad > 0) lines = lines.map(line => { return ' '.repeat(pad) + line })
                    rows[index]['rendered'] = lines
                }
                if (style.textAlign == 'right') {
                    lines = lines.map(line => line.padStart(maxOutputWidth, ' '))
                    rows[index]['rendered'] = lines
                }

            })

            return rows

        } // formatLines

        const splitCharacters = (text, font, fontSize, maxOutputWidth) => {

            const characters = text.split('')
            const rows = []
            let row = ''
            do {
                let character = characters.splice(0, 1)[0]
                if (character == '\n') {
                    rows.push(row)
                    row = ''
                    continue
                }
                row = row + character
                let lineWidth = font.getAdvanceWidth(row, fontSize) // This corresponds to canvas2dContext.measureText(text).width
                if (lineWidth < maxOutputWidth) continue
                row = row.slice(0, -1)
                rows.push(row)
                row = character

            } while (characters.length != 0)

            rows.push(row)
            return rows

        }

        const splitWords = (text, font, fontSize, maxOutputWidth) => {

            const separateLines = text.split(/\r?\n|\r|\n/g)
            let totalLines = []

            separateLines.forEach((line) => {
                let rows = []
                let row = ''
                let rowWidth = 0
                // Converts returns in spaces, removes double spaces and split by spaces
                const words = line.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').split(' ')
                do {
                    let word = words.splice(0, 1)[0]
                    let wordWidth = font.getAdvanceWidth(word, fontSize)
                    // Is this word alone is too long
                    if (wordWidth > maxOutputWidth) {
                        if (row.length != 0) row = row + ' '
                        let characters = word.split('')
                        do {
                            let character = characters.splice(0, 1)
                            rowWidth = font.getAdvanceWidth((row + character).trim(), fontSize)
                            if (rowWidth < maxOutputWidth) {
                                row = (row + character)
                                continue
                            }
                            rows.push(row)
                            row = character
                        } while (characters.length != 0)
                        continue
                    }
                    rowWidth = font.getAdvanceWidth(row + ' ' + word, fontSize)
                    if (rowWidth < maxOutputWidth) {
                        row = (row + ' ' + word).trim()
                        continue
                    }
                    rows.push(row)
                    row = word

                } while (words.length != 0)
                rows.push(row)
                totalLines = totalLines.concat(rows)
            })

            return totalLines

        } // splitWords

        const font = RenderFonts.#_loadFont(style.fontFile)
        let fontSize = 0
        let rendered

        if (style.textScale == 'height') {
            fontSize = getFontSizeForHeight(style.fontFile, maxOutputHeight)
        } else {
            fontSize = getFontSizeForWidth(text, font, maxOutputWidth)
        }

        if (style.wordWrap == 'none') {
            rendered = RenderFonts._drawLine(style.fontFile, fontSize, text).split(os.EOL)
            // Truncate output if longer than maxOutputWidth
            rendered = rendered.map(line => { return line.substring(0, maxOutputWidth) })
            // Only one row for wordWrap 'none'
            rendered = { 0: { text: text, rendered: rendered } }
        }

        if (style.wordWrap == 'oneline') {
            // Convert returns to spaces and remove double spaces
            text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            rendered = RenderFonts._drawLine(style.fontFile, fontSize, ' ' + text).split(os.EOL)
            // Only one row for wordWrap 'oneline'
            rendered = { 0: { text: text, rendered: rendered } }
            return rendered
        }

        if (style.wordWrap == 'letter') {
            rendered = {}
            rows = splitCharacters(text, font, fontSize, maxOutputWidth)
            rows = rows.filter(row => row !== '')
            rows.forEach((row, index) => {
                const lines = RenderFonts._drawLine(style.fontFile, fontSize, row).split(os.EOL)
                lines.map(line => line.substring(0, maxOutputWidth))
                rendered[index] = { text: row, rendered: lines }
            })
        }

        if (style.wordWrap == 'word') {
            rendered = {}
            rows = splitWords(text, font, fontSize, maxOutputWidth)
            rows = rows.filter(row => row !== '')
            rows.forEach((row, index) => {
                const lines = RenderFonts._drawLine(style.fontFile, fontSize, row).split(os.EOL)
                lines.map(line => line.substring(0, maxOutputWidth))
                rendered[index] = { text: row, rendered: lines }
            })
        }

        rendered = formatLines(rendered, style, maxOutputWidth)
        return rendered

    } // render

    static printFontSamples(text = 'Hello World 0123456789', fontsFolderPath = RenderFonts.#_defaultFontsFolderPath, fontSize = 8, maxOutputWidth = process.stdout.columns) {

        const files = fs.readdirSync(fontsFolderPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        files.forEach(fontFile => {

            if ((!fontFile.toLowerCase().endsWith('.ttf')) && (!fontFile.toLowerCase().endsWith('.otf'))) return
            const fontRealpath = path.join(fontsFolderPath, fontFile)

            const style = {
                fontFile: fontFile,
                textScale: 'height'
            }

            const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)

            let rendered = RenderFonts.render(text, maxOutputWidth, 10, style)
            // Find the maximum number of elements in the 'rendered' arrays
            const maxRenderedArrayLength = Math.max(...Object.values(rendered).map(obj => obj.rendered.length))
            console.log(`Font: [${fontFile}] - Output Height: ${maxRenderedArrayLength}`)
            console.log(ruler())
            Object.values(rendered).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
            console.log('\n')
        })

    } // renderFontSamples

} // RenderFonts

export { RenderFonts }
export default RenderFonts

// RenderFonts.printFontSamples()

// const textScales = ['height', 'width']
// const wordWraps = ['none', 'word', 'letter']
// const textAligns = ['left', 'center', 'right']
// const fontsFolderPath = path.resolve(__dirname + path.join('fonts', 'regular'))
// const fontFiles = fs.readdirSync(fontsFolderPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
// const maxOutputWidth = process.stdout.columns
// fontFiles.forEach(fontFile => {
//     if ((!fontFile.toLowerCase().endsWith('.ttf')) && (!fontFile.toLowerCase().endsWith('.otf'))) return
//     textScales.forEach((textScale) => {
//         wordWraps.forEach((wordWrap) => {
//             textAligns.forEach((textAlign) => {
//                 const style = {
//                     fontFile: fontFile,
//                     wordWrap: wordWrap,
//                     textAlign: textAlign,
//                     textScale: textScale
//                 }
//                 let rendered
//                 let maxRenderedArrayLength
//                 const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
//                 rendered = RenderFonts.render('Hello World', maxOutputWidth, 14, style)
// // Find the maximum number of elements in the 'rendered' arrays
// maxRenderedArrayLength = Math.max(...Object.values(rendered).map(obj => obj.rendered.length))
//                 console.log(`Font: [${fontFile}] - textScale: [${textScale}] - wordWrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${maxRenderedArrayLength}`)
//                 console.log(ruler())
//                 Object.values(rendered).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//                 console.log('\n')
//                 rendered = RenderFonts.render('Ελληνικά\nThe quick brown fox jumps over the lazy dog', maxOutputWidth, 14, style)
//                 // Find the maximum number of elements in the 'rendered' arrays
//                 maxRenderedArrayLength = Math.max(...Object.values(rendered).map(obj => obj.rendered.length))
//                 console.log(`Font: [${fontFile}] - textScale: [${textScale}] - wordWrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${maxRenderedArrayLength}`)
//                 console.log(ruler())
//                 Object.values(rendered).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//                 console.log('\n')
//                 // let rendered2 = RenderFonts.render('Ελληνικά\nThe quick brown fox jumps over the lazy dog', 150, 14, style)
//                 // console.log(`Font: [${fontFile}] - textScale: [${textScale}] - wordWrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${rendered2[0].rendered.length}`)
//                 // console.log(ruler())
//                 // Object.values(rendered2).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//                 // console.log('\n')
//             })
//         })
//     })
// })
