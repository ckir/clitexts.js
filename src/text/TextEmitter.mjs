'use strict';
import { EventEmitter } from 'node:events'
import os from 'node:os'
import chalk from 'chalk'

import deepmerge from '../misc/Deepmerge.mjs'
import stripAnsi from './lib/AnsiStrip.mjs'
import InitGradient from '../colors/GradientString.mjs'
import { RenderAnsi, RenderCFonts, RenderFiglet, RenderFonts, RenderJson } from './IndexRenderers.mjs'
import ThemeManager from '../themes/ThemeManager.mjs'
import { AnimationColor, AnimationScrolling } from './IndexAnimations.mjs'
import stringWidth from './lib/StringWidth.mjs';


export default class TextEmitter extends EventEmitter {

    #defaultsRender = {
        ansi: {}, // 'ansi' | 'cfonts' | 'figlet' | 'fonts' | json
        cfonts: {},
        figlet: {},
        fonts: {},
        json: {}
    }

    // Defaults for 'none' | 'color' | 'gradient' | 'theme'
    #defaultsColor = {
        none: {},
        color: {},
        theme: {
            brightness: 'normal', // 'normal' | 'bright'
            foreground: 'foreground', // 'foreground' | 'black' | 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'white' | 'yellow' | '# hex value'
            background: 'background'  // 'background' | 'black' | 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'white' | 'yellow' | '# hex value'
        },
        gradient: {
            gradient: 'rainbow', // [of hex color values] or predefined: 'atlas' | 'cristal' | 'teen' | 'mind' | 'morning' | 'vice' | 'passion' | 'fruit' | 'instagram' | 'retro' | 'summer' | 'rainbow' | 'pastel'
        }
    }

    #defaultsAnimation = {
        none: {}, // 'none' | 'color' | 'scrolling'
        color: {
            animationColorType: 'karaoke' // 'rainbow' | 'pulse' | 'glitch' | 'radar' | 'neon' | 'karaoke'
        },
        scrolling: {
            width: process.stdout.columns,
            frameDelay: 100
        }
    } // 'none' | 'color' | 'scrolling'

    #colorAnimationClassInstance = {}
    #colorAnimationEffects = {}

    constructor(renderOptions = { renderType: 'ansi' }, colorOptions = { colorType: 'theme' }, animationOptions = { animationType: 'none' }) {

        super()

        this.optionsRender = deepmerge(this.#defaultsRender[renderOptions.renderType], renderOptions)
        this.optionsColor = deepmerge(this.#defaultsColor[colorOptions.colorType], colorOptions)
        if (colorOptions.colorType == 'theme') {
            const themeColors = ThemeManager.getThemeColors()
            this.themeColors = { ...themeColors['primary'], ...themeColors[this.optionsColor.brightness] }
        }
        this.animationOptions = deepmerge(this.#defaultsAnimation[animationOptions.animationType], animationOptions)

        if (!this.optionsRender.renderType) this.optionsRender.renderType = 'ansi'
        if (!this.optionsColor.colorType) this.optionsColor.colorType = 'theme'
        if (!this.animationOptions.animationType) this.animationOptions.animationType = 'none'
        if (this.animationOptions.animationType == 'scrolling') this.optionsRender.wordWrap = 'oneline'

    } // constructor

    renderText(text, maxOutputWidth = process.stdout.columns, maxOutputHeight) {

        const replaceNonEnglishCharacters = (inputString) => {
            // Regular expression to match non-English characters
            const nonEnglishRegex = /[^A-Za-z0-9\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g

            // Replace non-English characters with '?'
            const replacedString = inputString.replace(nonEnglishRegex, '?')

            return replacedString
        }

        let rendered = null

        if ((this.optionsRender.renderType != 'ansi') || (this.optionsColor.colorType == 'gradient')) {
            text = stripAnsi(text)
        }
        // These renderers support only english and no colors
        if (['cfonts', 'figlet', 'json'].includes(this.optionsRender.renderType)) {
            text = replaceNonEnglishCharacters(text).trim()
        }

        switch (this.optionsRender.renderType) {
            case 'cfonts':
                rendered = RenderCFonts.render(text, maxOutputWidth, this.optionsRender)
                break
            case 'figlet':
                rendered = RenderFiglet.render(text, maxOutputWidth, this.optionsRender)
                break
            case 'fonts':
                rendered = RenderFonts.render(text, maxOutputWidth, maxOutputHeight, this.optionsRender)
                break
            case 'json':
                rendered = RenderJson.render(text, maxOutputWidth, this.optionsRender)
                break
            default: // ansi
                rendered = RenderAnsi.render(text, maxOutputWidth, this.optionsRender)
                break
        }

        Object.values(rendered).forEach((row, index) => {
            // Remove empty
            rendered[index].rendered = row.rendered.filter(entry => /\S/.test(entry))
            if (this.animationOptions.animationType == 'scrolling') return
            // Truncate output if longer than maxOutputWidth
            // rendered[index].rendered = row.rendered.map(line => line.substring(0, maxOutputWidth))
            // Pad to width
            rendered[index].rendered = row.rendered.map(line => line + ' '.repeat(maxOutputWidth - stringWidth(line)))
        })

        // If we don't have anything else to do we can stop here
        if ((this.optionsColor.colorType == 'none') && (this.animationOptions.animationType == 'none')) {
            this.emit('frame', rendered)
            return rendered
        }

        // We do animation 'color'  

        let animated = rendered

        if (this.animationOptions.animationType == 'color') {

            animated = this.mergedRendered(rendered)
            const text = animated[0].rendered.join(os.EOL)
            this.#colorAnimationClassInstance = new AnimationColor(0)
            this.#colorAnimationClassInstance.on('textAnimation', (frame) => {
                let rendered = frame.frame.split(os.eol).toString().split(os.EOL)
                this.emit('textAnimation', { [frame.id]: { text: animated[0].text, rendered: rendered } })
            })
            this.#colorAnimationEffects = this.#colorAnimationClassInstance[this.animationOptions.animationColorType](text)
            this.#colorAnimationEffects.start()

        }

        if (this.animationOptions.animationType == 'scrolling') {

            // One annimation for each row of text
            Object.values(animated).forEach((row, index) => {
                this.#colorAnimationClassInstance[index] = new AnimationScrolling(index, row, this.animationOptions)
                this.#colorAnimationClassInstance[index].on('textAnimation', (frame) => {
                    const colored = this.applyColor(frame)
                    this.emit('textAnimation', colored)
                })
                this.#colorAnimationClassInstance[index].startScrolling()
            })

        }

        // If we don't have anything else to do we can stop here
        if (this.animationOptions.animationType == 'none') {
            const colored = this.applyColor(rendered)
            this.emit('frame', colored)
            return colored
        }

    } // renderText

    applyColor(rendered) {

        let colored

        switch (this.optionsColor.colorType) {
            case 'color':
                colored = this.applyCustom(rendered)
                break
            case 'gradient':
                colored = this.applyGradient(rendered)
                break
            case 'none':
                colored = rendered
                break
            default: // 'theme'
                colored = this.applyTheme(rendered)
                break
        }

        return colored

    } // applyColor

    applyGradient(rendered) {

        Object.values(rendered).forEach((row, index) => {
            rendered[index].rendered = [InitGradient[this.optionsColor.gradient].multiline(row.rendered.join(os.EOL))]
        })

        return rendered

    } // applyGradient

    applyTheme(rendered) {

        const fg = this.themeColors[this.optionsColor.foreground]
        const bg = this.themeColors[this.optionsColor.background]

        Object.values(rendered).forEach((row, index) => {
            rendered[index].rendered = row.rendered.map(line => chalk.bgHex(bg).hex(fg)(line))
        })

        // Object.values(rendered).forEach((row) => console.log(row.rendered.join('\n'), '\n'))

        return rendered

    } // applyTheme

    mergedRendered(rendered) {

        const merged = Object.values(rendered).reduce((merged, { rendered }) => {

            if (merged.length > 0) {
                merged.push(' '.repeat(merged[0].length)) // Add a space line between arrays
            }

            return merged.concat(rendered)
        }, [])

        const mergedText = Object.values(rendered).map(item => item.text).join(' ')

        return { 0: { text: mergedText, rendered: merged } }

    } // mergedRendered


} // TextEmitter

// Test everything but animations
// const input = 'The quick 🌷🎁💩' + chalk.bgGrey(' 😜👍🏳️‍🌈 brown ') + chalk.red('fox jumped over ') +
//     'the lazy ' + chalk.green('dog and then') + chalk.bgRedBright(' ran away with the unicorn. 💛 ')

// const lorem = `
// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque nec nam aliquam sem et tortor. Fermentum odio eu feugiat pretium nibh ipsum. Nulla pharetra diam sit amet. Et netus et malesuada fames ac turpis egestas maecenas. Orci phasellus egestas tellus rutrum. Sed tempus urna et pharetra pharetra massa massa ultricies mi. Commodo elit at imperdiet dui accumsan. Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Eu ultrices vitae auctor eu augue ut lectus. Lectus proin nibh nisl condimentum id venenatis a condimentum. Nunc lobortis mattis aliquam faucibus purus in massa. Morbi tempus iaculis urna id volutpat lacus laoreet. Orci nulla pellentesque dignissim enim sit amet. Aliquam ultrices sagittis orci a scelerisque purus semper. Et malesuada fames ac turpis egestas. Faucibus in ornare quam viverra orci sagittis eu volutpat odio. Venenatis tellus in metus vulputate eu. Aliquam ultrices sagittis orci a scelerisque.
// `
// // 'none' | 'color' | 'gradient'
// const colorOptions = [{ type: 'none', options: {} }, { type: 'color', options: { fg: "#4a4543", bg: "#f7f7f7" } }, { type: 'gradient', options: { gradient: 'pastel' } }]
// colorOptions.forEach((colorOption) => {
//     // 'ansi' | 'cfonts' | 'figlet' | 'fonts' | json
//     const renderOptions = [
//         { renderType: 'ansi', },
//         { renderType: 'cfonts', },
//         { renderType: 'figlet', },
//         { renderType: 'fonts', },
//         { renderType: 'json', },
//     ]
//     renderOptions.forEach((renderOption) => {
//         const maxOutputWidth = process.stdout.columns
//         const ruler = (str = '1234567890', columns = maxOutputWidth) => str.repeat(Math.ceil(columns / str.length)).slice(0, columns)
//         const instance = new TextEmitter(renderOption)
//         const rendered = instance.renderText(input, maxOutputWidth, 10)
//         const maxRenderedArrayLength = Math.max(...Object.values(rendered).map(obj => obj.rendered.length))
//         console.log(`renderType: ${renderOption.renderType} - Output Height: ${maxRenderedArrayLength}`)
//         console.log(ruler())
//         Object.values(rendered).forEach((row) => console.log(row.rendered.join('\n'), '\n'))
//     })
// })

// // Animations test
// import ansiEscapes from '../terminal/AnsiEscapes.mjs'
// const input = 'The quick brown fox ||'
// const input = 'The quick 🌷🎁💩' + chalk.bgGrey('🏳️‍🌈😜👍brown ') + chalk.red('fox jumped over ') +
//     'the lazy ' + chalk.green('dog and then') + chalk.bgRedBright(' ran 💛 away with the unicorn.')
// const input = 'The quick brown fox jumped  over the lazy dog and then ran away with the unicorn'
// const renderOptions = { renderType: 'json' } // 'ansi' | 'cfonts' | 'figlet' | 'fonts' | json
// const colorOptions = { colorType: 'theme' }
// const animationOptions = { animationType: 'color', animationColorType: 'rainbow' }
// // const animationOptions = { animationType: 'scrolling', width: process.stdout.columns, frameDelay: 500 }

// const instance = new TextEmitter(renderOptions, colorOptions, animationOptions)
// instance.on('textAnimation', (rendered) => {
//     let row = Number(Object.keys(rendered).toString())
//     row = row * rendered[row].rendered.length + 2
//     process.stdout.write(ansiEscapes.cursorTo(0, row)) // Clear the terminal
//     Object.values(rendered).forEach((row) => process.stdout.write(row.rendered.join('\n')))
// })
// process.stdout.write(ansiEscapes.clearScreen + ansiEscapes.cursorHide)
// instance.renderText(input)

// const input = 'The quick brown fox jumped over the lazy dog and then ran away with the unicorn'
// let grad = InitGradient['rainbow'](input)
// grad = chalk.bgHex("#303030")(grad)
// console.log(grad)
