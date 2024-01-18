import os from 'node:os'
import fs from 'node:fs'
import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

import Figlet from './RenderFigletParser.mjs'

class RenderFiglet {

    static #_defaultFontsFolderPath = path.resolve(__dirname + path.join('fonts', 'figlet'))
    static #_figlet = new Figlet(RenderFiglet.#_defaultFontsFolderPath, 'ANSI Regular')

    static getFontNames() {

        return RenderFiglet.#_figlet.getFontNames().sort()

    }

    static getFontInfo() {

        return RenderFiglet.#_figlet.getFontInfo()

    }

    static #_drawLine(text, font, removeEmptyLines = true, trim = true) {

        let lines = RenderFiglet.#_figlet.write(text, font, removeEmptyLines, trim)
        return lines

    }

    static render(text, maxOutputWidth, style = {}) {

        const defaults = {
            fontName: 'ANSI Regular',
            wordWrap: 'letter', // 'none' | 'word' | 'letter' | 'oneline'
            textAlign: 'left', // 'left' | 'center' | 'right
        }
        style = { ...defaults, ...style }

        let rendered = []

        const formatLines = (rows, style, maxOutputWidth) => {

            Object.values(rows).forEach((row, index) => {

                let lines = row.rendered
                // lines.map(line => line.substring(0, maxOutputWidth))
                
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
                // lines.map(line => line.substring(0, maxOutputWidth))

            })

            return rows

        } // formatLines

        const splitCharacters = (text, fontName, maxOutputWidth) => {

            const characters = text.split('')
            const rows = {}
            let row = ''
            let row_index = 0
            let rendered
            let rendered_previous

            do {
                let character = characters.splice(0, 1)[0]
                if (character == '\n') {
                    rows[row_index] = { text: row, rendered: rendered_previous }
                    row_index++
                    row = ''
                    continue
                }
                row = row + character
                rendered = RenderFiglet.#_drawLine(row, fontName).split(os.EOL)
                let lineWidth = rendered.reduce((a, b) => a.length > b.length ? a : b, '').length
                if (lineWidth < maxOutputWidth) {
                    rendered_previous = rendered
                    continue
                }
                row = row.slice(0, -1)
                rows[row_index] = { text: row, rendered: rendered_previous }
                row_index++
                row = character

            } while (characters.length != 0)

            rows[row_index] = { text: row, rendered: rendered }
            return rows

        } // splitCharacters

        const splitWords = (text, fontName, maxOutputWidth) => {

            // Converts returns in spaces, removes double spaces and split by spaces
            const words = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').replace(/(\r\n|\n|\r)/gm, ' ').split(' ')
            const rows = {}
            let row = ''
            let row_index = 0
            let rendered
            let rendered_previous

            function replaceLastOccurrence(inputString, searchValue, replaceValue) {
                const lastIndex = inputString.lastIndexOf(searchValue)
                if (lastIndex === -1) {
                    return inputString // Search value not found
                }
                const modifiedString = inputString.substring(0, lastIndex) + inputString.substring(lastIndex).replace(searchValue, replaceValue);
                return modifiedString.trim() + ' '
            }

            do {
                let word = words.splice(0, 1)[0]
                row = row + word + ' '
                rendered = RenderFiglet.#_drawLine(row, fontName).split(os.EOL)
                let lineWidth = rendered.reduce((a, b) => a.length > b.length ? a : b, '').length
                if (lineWidth < maxOutputWidth) {
                    rendered_previous = rendered
                    continue
                }
                row = replaceLastOccurrence(row, word, '').replace(/\s+/g, ' ')
                rows[row_index] = { text: row, rendered: rendered_previous }
                row_index++
                row = word + ' '

            } while (words.length != 0)

            rows[row_index] = { text: row, rendered: RenderFiglet.#_drawLine(row, fontName).split(os.EOL) }
            return rows

        } // splitWords

        if (style.wordWrap == 'none') {
            // Convert returns to spaces and remove double spaces
            text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            rendered = RenderFiglet.#_drawLine(text, style.fontName)
            // Truncate output if longer than maxOutputWidth
            rendered = rendered.split(os.EOL)
            rendered = rendered.map(line => line.substring(0, maxOutputWidth))
            rendered = { 0: { text: text, rendered: rendered } }
        }

        if (style.wordWrap == 'oneline') {
            // Convert returns to spaces and remove double spaces
            text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            rendered = RenderFiglet.#_drawLine(' ' + text, style.fontName)
            rendered = rendered.split(os.EOL)
            rendered = { 0: { text: text, rendered: rendered } }
            return rendered
        }

        if (style.wordWrap == 'letter') {
            rendered = splitCharacters(text, style.fontName, maxOutputWidth)
        }

        style.wordWrap == 'word'
        if (style.wordWrap == 'word') {
            rendered = splitWords(text, style.fontName, maxOutputWidth)
        }

        rendered = formatLines(rendered, style, maxOutputWidth)
        return rendered

    } // render

    static printFontSamples(text = 'The quick brown fox jumps over the lazy dog.', fontsFolderPath = RenderFiglet.#_defaultFontsFolderPath, maxOutputWidth = process.stdout.columns) {

        fontsFolderPath = path.resolve(fontsFolderPath)

        const files = fs.readdirSync(fontsFolderPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        files.forEach(fontFile => {
            if (!fontFile.toLowerCase().endsWith('.flf')) return
            const fontRealpath = path.join(fontsFolderPath, fontFile)
            const font = path.parse(fontRealpath).name
            const style = {
                fontName: font,
                wordWrap: 'letter', // 'none' | 'word' | 'letter',
                textAlign: 'left', // 'left' | 'center' | 'right
            }
            let output = RenderFiglet.render('1234567890', maxOutputWidth, style)
            console.log(`Font: [${font}] - Output Height: ${output[0].rendered.length}`)
            const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
            console.log(ruler())
            Object.values(output).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
            console.log('\n')
        })

    }
}

export { RenderFiglet }
export default RenderFiglet

// RenderFiglet.printFontSamples()

// const fonts = RenderFiglet.getFontNames()
// const wordWraps = ['none', 'word', 'letter']
// const textAligns = ['left', 'center', 'right']

// fonts.forEach((font) => {

//     wordWraps.forEach((wordWrap) => {

//         textAligns.forEach((textAlign) => {

//             const style = {
//                 fontName: font,
//                 wordWrap: wordWrap, // 'none' | 'word' | 'letter',
//                 textAlign: textAlign, // 'left' | 'center' | 'right
//             }
//             console.log(font)

       
//             const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
//             console.log(ruler())
//             let output = RenderFiglet.render('The quick brown fox jumps over the lazy dog.', process.stdout.columns, style)
//             console.log(`Font: [${font}]: - Word Wrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${output[0].rendered.length}`)
//             Object.values(output).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//             console.log('\n')
//         })

//     })

// })