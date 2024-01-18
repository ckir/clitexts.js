import Box from "./Box.mjs"
import deepmerge from "../misc/Deepmerge.mjs"
import wrapAnsi from "../text/lib/AnsiWrap.mjs"

export default class BoxScrollable extends Box {

    lines = null

    constructor(boxWidth = process.stdout.columns || 79, boxHeight = process.stdout.rows || 3, boxOptions = {}) {

        // This box must have the following configuration
        const defaultsBox = {
            boxTitle: { options: { hAlign: 'left' } },
            boxContent: { renderOptions: { type: 'ansi' }, styleOptions: { vAlign: 'top' } }
        }

        // Required configuration prevails user input
        boxOptions = deepmerge(boxOptions, defaultsBox)
        super(boxWidth, boxHeight, boxOptions)
        this.boxOptions = boxOptions
    } // constructor

    render(text, maxOutputWidth = this.boxWidth - 2, maxOutputHeight = this.boxHeight - 2) {
        text = (this.lines == null)? text : this.lines + '\n' + text
        let wrapped = wrapAnsi(text, maxOutputWidth, { hard: true, wordWrap: false }).split('\n')
        if (wrapped.length > maxOutputHeight) {
            wrapped = wrapped.slice(wrapped.length - maxOutputHeight)
        }
        text = wrapped.join('\n')
        this.lines = text
        this.textEmitter.renderText(text, maxOutputWidth, maxOutputHeight)

    }

} // BoxScrollable

// import chalk from "chalk"
// import ThemeManager from "../themes/ThemeManager.mjs"
// ThemeManager.loadTheme('Tango', 'round')
// const themeColors = ThemeManager.getThemeColors()

// import TextCanvas from "../terminal/TextCanvas.mjs"
// const textCanvas = new TextCanvas(640, 480, { cleanValue: themeColors.primary.padCharacterRepeat })

// const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'
// const input = 'The quick 🏳️‍🌈 🦄 🎠 🐴 🐎 ❤ ✨ 🌈 🌷🎁💩' + chalk.bgGrey(' 😜👍🏳️‍🌈 brown ') + chalk.red('fox jumped over ') +
//     'the lazy ' + chalk.green('dog and then') + chalk.bgRedBright(' ran away with the unicorn. 💛 ') 
// const box1 = new BoxScrollable(150, 10)
// box1.on('box', (boxrows) => { // box1 will emit just once
//     const rows = boxrows.split(/\r\n|\r|\n/)
//     textCanvas.draw(2, 2, rows)
// })
// box1.render(input + lorem + lorem + lorem + " ***END")
// let a = detectStrings(input)
// box1.render(input)
