'use strict';
import { EventEmitter } from 'node:events'
import chalk from 'chalk'

import deepmerge from '../misc/Deepmerge.mjs'
import stripAnsi from './AnsiStrip.mjs'
import InitGradient from '../colors/GradientString.mjs'
import RenderAnsi from './RenderAnsi.mjs'
import RenderCFonts from './RenderCfonts.mjs'
import RenderFiglet from './RenderFiglet.mjs'
import RenderFonts from './RenderFonts.mjs'
import stringWidth from './StringWidth.mjs'
import { detectStrings } from './EmojiDetect.mjs'
import TextAnimation from '../colors/TextAnimation.mjs'

export default class TextEmitter extends EventEmitter {

    #defaultsRender = { type: 'ansi', options: {} } // 'ansi' | 'figlet' | 'fonts' | 'cfonts'
    #defaultsColor = { type: 'none', options: {} } // 'none' | 'color' | 'gradient' | 'animation'

    #animator = new TextAnimation()
    #animation = null

    constructor(renderOptions, colorOptions) {
        super()
        this.optionsRender = deepmerge(this.#defaultsRender, renderOptions)
        this.optionsColor = deepmerge(this.#defaultsColor, colorOptions)

        this.#animator.on('textAnimation', (content) => {
            // Remove clear from annimated text
            content = content.replace(/\u001B\[([0-9;]*F)\u001B\[G\u001B\[2K/, '')
            if (content.trim().length > 0) this.emit('text', [content])
        })
    }

    renderText(text, maxOutputWidth, maxOutputHeight) {

        let rendered = null

        switch (this.optionsRender.type) {
            case 'cfonts':
                rendered = RenderCFonts.render(stripAnsi(text), maxOutputWidth, this.optionsRender.options)
                break;
            case 'figlet':
                rendered = RenderFiglet.render(stripAnsi(text), maxOutputWidth, this.optionsRender.options)
                break;
            case 'fonts':
                rendered = RenderFonts.render(stripAnsi(text), maxOutputWidth, maxOutputHeight, this.optionsRender.options)
                break;
            default: // ansi
                rendered = RenderAnsi.render(text, maxOutputWidth, this.optionsRender.options)
                break;
        }

        rendered.forEach((line, index) => {
            let rows = line.split('\n')
            rows = rows.map((row) => {
                // Fix around bug in stringWidth not supporting 🏳️‍🌈
                let adjust = detectStrings(row).filter(item => item.includes("-")).length
                adjust = (adjust > 0) ? adjust * 3 - adjust + 1 : 0
                const padLength = maxOutputWidth - stringWidth(row) - adjust
                return (padLength > 0) ? row + ' '.repeat(padLength) : row
            })
            rendered[index] = rows.join('\n')
        })

        if (this.optionsColor.type == 'none') this.emit('text', rendered)
        else this.#colorize(rendered)
    }

    #colorize(text) {

        let colored = null

        switch (this.optionsColor.type) {
            case 'animation':
                if (this.#animation) this.#animation.stop()
                text = text.join('\n')
                this.#animation = this.#animator[this.optionsColor.options.type](stripAnsi(text))
                this.#animation.start()
                break;
            case 'gradient':
                text.forEach((line, index) => {
                    let rows = line.split('\n')
                    rows = rows.map((row) => {
                        if (typeof this.optionsColor.options.gradient == 'string') {
                            return InitGradient[this.optionsColor.options.gradient](stripAnsi(row))
                        } else {
                            return InitGradient(this.optionsColor.options.gradient)(stripAnsi(row))
                        }
                    })
                    text[index] = rows.join('\n')
                })
                this.emit('text', text)
                break;
            default: // 'color'
                text.forEach((line, index) => {
                    let rows = line.split('\n')
                    rows = rows.map((row) => {
                        return chalk.bgHex(this.optionsColor.options.bg).hex(this.optionsColor.options.fg)(row)
                    })
                    text[index] = rows.join('\n')
                })
                this.emit('text', text)
                break;
        }

    }

}

// // Test everything but animattions
// const input = 'The quick brown ' + chalk.red('fox jumped over ') +
//     'the lazy ' + chalk.green('dog and then ran away with the unicorn. ');

// [{ type: 'ansi', options: {} }, { type: 'cfonts', options: {} }, { type: 'figlet', options: {} }, { type: 'fonts', options: {} }].forEach((renderer) => {
//     [{ type: 'none', options: {} }, { type: 'color', options: { fg: "#4a4543", bg: "#f7f7f7" } }, { type: 'gradient', options: { gradient: 'pastel' } }].forEach((colorType) => {
//         const instance = new TextEmitter(renderer, colorType)
//         instance.on('text', (rendered) => {
//             console.log(`Renderer [${renderer.type}] - ColorType [${colorType.type}]`)
//             console.log('0123456789'.repeat(15))
//             rendered.forEach((line) => console.log(line, '\n'))
//         })
//         instance.renderText(input, 150)
//     })
// })

// // Animations test
// const input = 'The quick brown fox jumped over the lazy dog';
// const renderer = { type: 'fonts', options: {} }
// const colorType = { type: 'animation', options: { type: 'rainbow' } }
// const instance = new TextEmitter(renderer, colorType)
// instance.on('text', (rendered) => {
//     rendered.forEach((line) => console.log(line))
// })
// instance.renderText(input, 150)

// const input = 'The quick brown fox jumped over the lazy dog and then ran away with the unicorn'
// let grad = InitGradient['rainbow'](input)
// grad = chalk.bgHex("#303030")(grad)
// console.log(grad)
