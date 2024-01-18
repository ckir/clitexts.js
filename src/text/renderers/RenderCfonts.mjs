import cfonts from 'cfonts'

class RenderCFonts {

    static #MAXLINEWIDTH = 10000

    static #defaults_cfonts = {
        font: 'block',              // define the font face
        align: 'left',              // define text alignment
        colors: ['system'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
        gradient: false,            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'                 // define the environment cfonts is being executed in
    }

    static #defaults_style = {
        fontName: this.#defaults_cfonts.font,
        wordWrap: 'letter', // 'none' | 'word' | 'letter' | 'oneline'
        textAlign: 'left', // 'left' | 'center' | 'right
    }

    static render(text, maxOutputWidth, style = {}, cfontsOptions = { space: false }) {

        cfontsOptions = { ...RenderCFonts.#defaults_cfonts, ...cfontsOptions }
        style = { ...this.#defaults_style, ...style }
        if (style.fontName) cfontsOptions.font = style.fontName
        // We will do our own alligment
        cfontsOptions.align = 'left'
        // This must be false for rendering
        cfontsOptions.space = false

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

        const splitCharacters = (text, cfontsOptions = cfontsOptions, maxOutputWidth) => {

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
                rendered = cfonts.render(row, cfontsOptions, false, 0, { width: this.#MAXLINEWIDTH })
                rendered = rendered.array
                rendered = rendered.map(line => line.trimEnd())
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

        const splitWords = (text, cfontsOptions = cfontsOptions, maxOutputWidth) => {

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
                rendered = cfonts.render(row, cfontsOptions, false, 0, { width: this.#MAXLINEWIDTH })
                rendered = rendered.array
                let lineWidth = rendered.reduce((a, b) => a.length > b.length ? a : b, '').length
                if (lineWidth < maxOutputWidth) {
                    rendered_previous = rendered
                    continue
                }
                row = replaceLastOccurrence(row, word, '').replace(/\s+/g, ' ')
                rows[row_index] = { text: row, rendered: rendered_previous }
                row_index++
                row = word

            } while (words.length != 0)

            rows[row_index] = { text: row, rendered: cfonts.render(row, cfontsOptions, false, 0, { width: this.#MAXLINEWIDTH }).array }
            return rows

        } // splitWords

        let rendered

        if (style.wordWrap == 'none') {
            rendered = cfonts.render(text, cfontsOptions, false, 0, { width: this.#MAXLINEWIDTH })
            rendered = rendered.array
            // Truncate output if longer than maxOutputWidth
            rendered = rendered.map(line => line.substring(0, maxOutputWidth))
            // Only one row for wordWrap 'none'
            rendered = { 0: { text: text, rendered: rendered } }
        }

        if (style.wordWrap == 'oneline') {
            // Convert returns to spaces and remove double spaces
            text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            rendered = cfonts.render(' ' + text, cfontsOptions, false, 0, { width: this.#MAXLINEWIDTH })
            rendered = rendered.array
            // Only one row for wordWrap 'oneline'
            rendered = { 0: { text: text, rendered: rendered } }
            return rendered
        }

        if (style.wordWrap == 'letter') {
            rendered = splitCharacters(text, cfontsOptions, maxOutputWidth)
        }

        if (style.wordWrap == 'word') {
            rendered = splitWords(text, cfontsOptions, maxOutputWidth)
        }

        rendered = formatLines(rendered, style, maxOutputWidth)
        return rendered

    } // render

    static printFontSamples(text = 'The quick brown fox jumps over the lazy dog.', maxOutputWidth = process.stdout.columns) {

        const fonts = ["3d", "block", "chrome", "console", "grid", "huge", "pallet", "shade", "simple", "simple3d", "simpleBlock", "slick", "tiny"]
        fonts.forEach((font) => {

            const wordWraps = ['none', 'word', 'letter']
            wordWraps.forEach((wordWrap) => {

                const textAligns = ['left', 'center', 'right']
                textAligns.forEach((textAlign) => {

                    const cfontsOptions = {
                        font: font,                 // define the font face
                        align: 'left',              // define text alignment
                        colors: ['system'],         // define all colors
                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                        letterSpacing: 1,           // define letter spacing
                        lineHeight: 1,              // define the line height
                        space: true,                // define if the output text should have empty lines on top and on the bottom
                        maxLength: '0',             // define how many character can be on one line
                        gradient: false,            // define your two gradient colors
                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                        transitionGradient: false,  // define if this is a transition between colors directly
                        env: 'node'                 // define the environment cfonts is being executed in
                    }

                    const style = {
                        fontName: font,
                        wordWrap: wordWrap, // 'none' | 'word' | 'letter',
                        textAlign: textAlign, // 'left' | 'center' | 'right
                    }

                    const output = RenderCFonts.render(text, maxOutputWidth, style, cfontsOptions)
                    // console.log(`Font: [${font}] - Output Height: ${output[0].rendered.length}`)
                    console.log(`Font: [${font}]: - Word Wrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${output[0].rendered.length}`)

                    const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
                    console.log(ruler())
                    Object.values(output).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
                    console.log('\n')

                })

            })

        })

    } // printFontSamples

} // RenderCFonts

export { RenderCFonts }
export default RenderCFonts

// RenderCFonts.printFontSamples()

// const text = 'The quick brown fox jumps over the lazy dog.'
// const maxOutputWidth = process.stdout.columns
// const fonts = ["3d", "block", "chrome", "console", "grid", "huge", "pallet", "shade", "simple", "simple3d", "simpleBlock", "slick", "tiny"]
// const alignments = ['left', 'center', 'right']
// fonts.forEach((font) => {

//     alignments.forEach(alignment => {

//         const cfontsOptions = {
//             font: font,                 // define the font face
//             align: alignment,              // define text alignment
//             colors: ['system'],         // define all colors
//             background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
//             letterSpacing: 1,           // define letter spacing
//             lineHeight: 1,              // define the line height
//             space: true,                // define if the output text should have empty lines on top and on the bottom
//             maxLength: '0',             // define how many character can be on one line
//             gradient: false,            // define your two gradient colors
//             independentGradient: false, // define if you want to recalculate the gradient for each new line
//             transitionGradient: false,  // define if this is a transition between colors directly
//             env: 'node'                 // define the environment cfonts is being executed in
//         }

//         const output = RenderCFonts.render(text, maxOutputWidth, {}, cfontsOptions)
//         console.log(`Font: [${font}]: - Word Wrap: [${wordWrap}] - textAlign: [${textAlign}] - Output Height: ${output[0].rendered.length}`)
//         const ruler = (str = '1234567890', columns = process.stdout.columns) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
//         console.log(ruler())
//         Object.values(output).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//         console.log('\n')

//     })

// })