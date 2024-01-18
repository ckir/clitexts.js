import os from 'node:os'
import fs from 'node:fs'
import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
const __dirname = fileURLToPath(new URL('.', import.meta.url))


class RenderJson {

    static #_defaultFontsFolderPath = path.resolve(__dirname + path.join('fonts', 'json'))
    static #_loadedFonts = {}

    static #_loadFont(fontRealpath) {
        const isFileNameOnly = path.basename(fontRealpath) === fontRealpath
        fontRealpath = (isFileNameOnly) ? path.join(RenderJson.#_defaultFontsFolderPath, fontRealpath) : fontRealpath
        if (!RenderJson.#_loadedFonts[fontRealpath]) RenderJson.#_loadedFonts[fontRealpath] = JSON.parse(fs.readFileSync(fontRealpath).toString())
        return RenderJson.#_loadedFonts[fontRealpath]
    }

    static #_drawLine(text, font, removeEmptyLines = true, trim = true) {

        const gap = [[0]];

        const areTouching = (first, second) => {
            for (let i = 0; i < first.length; ++i) {
                if (first[i] && first[i][first[i].length - 1] === 1) {
                    for (let j = -1; j <= 1; ++j) {
                        if (second[i + j] && second[i + j][0] === 1) {
                            return true;
                        }
                    }
                }
            }
        }

        const renderLine = (text, font) => {
            const letters = text.split("");
            const characters = [];
            let maxHeight = 0;
            for (let letter of letters) {
                let glyph = font.glyphs[""];
                if (font.glyphs[letter]) {
                    glyph = font.glyphs[letter]
                } else {
                    log.warn(`Missing letter ${letter}`)
                }
                let newCharacter = [];
                glyph.pixels.forEach((row, index) => {
                    newCharacter[index + glyph.offset] = row;
                });
                maxHeight = Math.max(maxHeight, newCharacter.length);
                if (font.isFixedWidth ||
                    (characters.length && areTouching(characters[characters.length - 1], newCharacter))) {
                    characters.push(gap);
                }
                characters.push(newCharacter);
            }
            return characters.reduce((acc, cur) => {
                const blankRow = Array(cur[cur.length - 1].length).fill(0);
                for (let i = 0; i < maxHeight; ++i) {
                    const row = cur[i] || blankRow;
                    acc[i].push(...row);
                }
                return acc;
            }, Array(maxHeight).fill(0).map(_ => []));
        }

        const renderPixels = (text, font) => {
            const lines = text.split("\n").map(line => [[0]].concat(renderLine(line, font)));
            lines[0].shift();
            return [].concat(...lines);
        };

        return renderPixels(text, font)

    } // #_drawLine

    static render(text, maxOutputWidth, style = {}) {

        const defaults = {
            fontFile: path.join(RenderJson.#_defaultFontsFolderPath, 'seven-plus.json'),
            wordWrap: 'letter', // 'none' | 'word' | 'letter' | 'oneline'
            textAlign: 'left', // 'left' | 'center' | 'right
            textScale: 'width' // 'height' | 'width'
        }
        style = { ...defaults, ...style }
        const font = RenderJson.#_loadFont(style.fontFile)

        const toCharacters = (array, charForOne = '#', charForZero = ' ') => {
            let result = array.map(row => row.map(value => value === 1 ? charForOne : charForZero))
            result = result.map(value => value.join(''))
            return result;
        } // replaceValuesInArray

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

        const splitCharacters = (text, fontData, maxOutputWidth) => {

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
                let output = this.#_drawLine(row, fontData)
                output = output.map((rowArray) => rowArray.join(''))
                let lineWidth = output.reduce((a, b) => a.length > b.length ? a : b, '').length
                if (lineWidth < maxOutputWidth) continue
                row = row.slice(0, -1)
                rows.push(row)
                row = character

            } while (characters.length != 0)

            rows.push(row)
            return rows

        } // splitCharacters

        const splitWords = (text, fontName, maxOutputWidth) => {

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
                    let output = RenderJson.#_drawLine(word, fontName)
                    let wordWidth = output.reduce((a, b) => a.length > b.length ? a : b, '').length
                    // Is this word alone is too long
                    if (wordWidth > maxOutputWidth) {
                        if (row.length != 0) row = row + ' '
                        let characters = word.split('')
                        do {
                            let character = characters.splice(0, 1)
                            output = RenderJson.#_drawLine((row + character).trim(), fontName).split(os.EOL).length
                            rowWidth = output.reduce((a, b) => a.length > b.length ? a : b, '').length
                            if (rowWidth < maxOutputWidth) {
                                row = (row + character)
                                continue
                            }
                            rows.push(row)
                            row = character
                        } while (characters.length != 0)
                        continue
                    }
                    output = RenderJson.#_drawLine(row + ' ' + word, fontName)
                    rowWidth = output.reduce((a, b) => a.length > b.length ? a : b, '').length
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


        let lines = null
        let rendered = {}
        let rows = []

        if (style.wordWrap == 'none') {
            rows = splitCharacters(text, font, maxOutputWidth)
            lines = toCharacters(this.#_drawLine(rows[0], font))
            rendered[0] = { text: rows[0], rendered: lines }
        }

        if (style.wordWrap == 'oneline') {
            // Convert returns to spaces and remove double spaces
            text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            lines = toCharacters(this.#_drawLine(' ' + text, font))
            lines = lines.map(line => line.padEnd(maxOutputWidth, ' '))
            rendered[0] = { text: text, rendered: lines }
            return rendered
        }

        if (style.wordWrap == 'letter') {
            lines = {}
            rows = splitCharacters(text, font, maxOutputWidth)
            rows.forEach((row, index) => lines[index] = toCharacters(this.#_drawLine(row, font)))
            rows.forEach((row, index) => rendered[index] = { text: row, rendered: lines[index] })
        }

        if (style.wordWrap == 'word') {
            lines = {}
            rows = splitWords(text, font, maxOutputWidth)
            rows.forEach((row, index) => lines[index] = toCharacters(this.#_drawLine(row, font)))
            rows.forEach((row, index) => rendered[index] = { text: row, rendered: lines[index] })
        }

        rendered = formatLines(rendered, style, maxOutputWidth)
        return rendered

    } // render

    static printFontSamples(text, fontsFolderPath = RenderJson.#_defaultFontsFolderPath, fontSize = 8, maxOutputWidth = process.stdout.columns) {

        fontsFolderPath = path.resolve(fontsFolderPath)

        const files = fs.readdirSync(fontsFolderPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        files.forEach(fontFile => {
            if (!fontFile.toLowerCase().endsWith('.json')) return
            const fontRealpath = path.join(fontsFolderPath, fontFile)
            let rows = RenderJson.render(text, process.stdout.columns, { fontFile: fontFile })
            rows = rows.map(line => { return line.split(os.EOL) })
            console.log(`Font: [${fontFile}] - Output Height: [${rows[0].length}] - Output Width: [${rows[0][0].length}]`)
            rows.map(line => console.log(line.join('\n')))
            // console.log(lines.join(os.EOL))
            console.log('\n')
        })

    } // printFontSamples

} // RenderJson

export { RenderJson as RenderFonts }
export default RenderJson

// RenderJson.renderFontSamples()

// const textScales = ['height', 'width']
// const wordWraps = ['none', 'word', 'letter']
// const textAligns = ['left', 'center', 'right']
// const fontsFolderPath = path.resolve(__dirname + path.join('fonts', 'json'))
// const files = fs.readdirSync(fontsFolderPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
// files.forEach((fontFile) => {
//     if (!fontFile.toLowerCase().endsWith('.json')) return
//     textScales.forEach((textScale) => {
//         wordWraps.forEach((wordWrap) => {
//             textAligns.forEach((textAlign) => {
//                 const style = {
//                     fontFile: path.join(path.resolve(__dirname + path.join('fonts', 'json')), fontFile),
//                     wordWrap: wordWrap,
//                     textAlign: textAlign,
//                     textScale: textScale
//                 }
//                 let output = RenderJson.render('Hello World', process.stdout.columns, style)
//                 // Find the maximum number of elements in the 'rendered' arrays
//                 const maxRenderedArrayLength = Math.max(...Object.values(output).map(obj => obj.rendered.length))
//                 console.log(`Font: [${fontFile}] - textScale: [${textScale}] - wordWrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${maxRenderedArrayLength}`)
//                 const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
//                 console.log(ruler())
//                 Object.values(output).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//                 console.log('\n')
//             })
//         })
//     })
// })
