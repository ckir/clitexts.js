import chalk from 'chalk'
import GraphemeSplitter from './GraphemeSplitter.mjs'
import { createAnsiSequenceParser, createColorPalette } from './AnsiSequenceParser/index.mjs'

const parser = createAnsiSequenceParser()
const colorPalette = createColorPalette()
const graphemeSplitter = new GraphemeSplitter()

export default class AnsiSplitter {

    constructor(text) {
        this.text = text
    }

    toColorBlocks() {
        return this.text.split(/\r?\n/).map((line) => parser.parse(line))
    }

    toColoredGraphemes(byLine = true) {

        let output = []
        const tokensByLine = this.toColorBlocks()
        for (const lineTokens of tokensByLine) {
            let lineOutput = []
            for (const token of lineTokens) {
                let foregroundValue = ''
                let backgroundValue = ''
                if (token.foreground) {
                    foregroundValue = colorPalette.value(token.foreground)
                }
                if (token.background) {
                    backgroundValue = colorPalette.value(token.background)
                }

                const graphemes = graphemeSplitter.splitGraphemes(token.value)
                for (let index = 0; index < graphemes.length; index++) {
                    let grapheme = graphemes[index]
                    for (const decoration of token.decorations) {
                        grapheme = chalk[decoration](grapheme)
                    }                    
                    if (foregroundValue) grapheme = chalk.hex(foregroundValue)(grapheme)
                    if (backgroundValue) grapheme = chalk.bgHex(backgroundValue)(grapheme)
                    lineOutput.push(grapheme)
                }
            }
            output.push(lineOutput)
        }

        if (byLine) return output
        else return output.flat()

    }

}

// const input = "The quick 🌷🎁💩😜👍🏳️‍🌈 brown \u001b[31mfox jumped over \u001b[39mthe lazy \u001b[32mdog and then ran\u001b[39m\u001b[4m away with the unicorn. 💛\u001b[24m"
// const splitter = new AnsiSplitter(input)
// const colorBlocks = splitter.toColorBlocks()
// const graphemes = splitter.toColoredGraphemes()
// console.log(graphemes.flat().join(''))