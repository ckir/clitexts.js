import wrapAnsi from "../lib/AnsiWrap.mjs"
import ansiAlign from "../lib/AnsiAlign.mjs"
import widestLine from "../lib/WidestLine.mjs"
import sliceAnsi from "../lib/AnsiSlice.mjs"
import stringWidth from '../lib/StringWidth.mjs'


class RenderAnsi {

    static render(text, maxOutputWidth, style = {}) {

        const defaults = {
            wordWrap: 'letter', // 'none' | 'word' | 'letter' | 'oneline'
            textAlign: 'left', // 'left' | 'center' | 'right,
        }
        style = { ...defaults, ...style }

        let lines = ''
        let output = {}

        switch (style.wordWrap) {
            case 'word':
                lines = wrapAnsi(text, maxOutputWidth, { hard: true })
                break
            case 'letter':
                lines = wrapAnsi(text, maxOutputWidth, { hard: true, wordWrap: false })
                break
            case 'oneline':
                // Convert returns to spaces and remove double spaces
                // lines = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
                lines = text
                lines = ' '. repeat(maxOutputWidth - stringWidth(lines)) + lines
                output[0] = { text: text, rendered: [lines] }
                return output
            default: // 'none'
                // Convert returns to spaces and remove double spaces
                lines = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
                lines = sliceAnsi(lines, 0, maxOutputWidth)
                break
        }

        lines = ansiAlign(lines, { align: style.textAlign })
        const longest = widestLine(lines)
        let rows = lines.split('\n')
        if (style.textAlign == 'center') {
            rows = rows.map(row => { return ' '.repeat((maxOutputWidth - longest) / 2) + row })
        }
        if (style.textAlign == 'right') {
            rows = rows.map(row => { return ' '.repeat(maxOutputWidth - stringWidth(row)) + row })
        }

        rows = rows.filter(entry => /\S/.test(entry))
        rows.forEach((item, index) => {
            output[index] = { text: item, rendered: [item] }
        })
        return output

    } // render

} // RenderAnsi

export { RenderAnsi }
export default RenderAnsi

// import chalk from "chalk";
// const wordWraps = ['none', 'word', 'letter']
// const textAligns = ['left', 'center', 'right']
// const input = 'The quick brown ' + chalk.red('fox jumped over ') +
// 	'the lazy ' + chalk.green('dog and then ran away with the unicorn. ');

// wordWraps.forEach((wordWrap) => {
//     textAligns.forEach((textAlign) => {
//         const style = {
//             wordWrap: wordWrap, // 'none' | 'word' | 'letter',
//             textAlign: textAlign, // 'left' | 'center' | 'right
//         }
//         console.log(`textScale: [wordWrap: [${wordWrap}] - textAlign: [${textAlign}]`)
//         let output = RenderAnsi.render(input.repeat(3), 150, style)
//         console.log('0123456789'.repeat(15))
//         output.forEach((line) => console.log(line))
//         console.log('\n')
//     })
// })