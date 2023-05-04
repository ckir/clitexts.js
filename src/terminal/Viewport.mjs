import { EventEmitter } from 'node:events'
import * as readline from 'node:readline'
readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
}
import { debounce } from '../misc/Debounce.mjs'
import ansiEscapes from './AnsiEscapes.mjs'


export class Viewport extends EventEmitter {

    static async #render(rows) {
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index]
            process.stdout.write(ansiEscapes.cursorTo(0,index) + ansiEscapes.cursorHide + row + ansiEscapes.cursorHide)
        }
    }

    #data = []
    set contentRows(value) {
        this.data = value
        Viewport.#render(value)
    }
    get contentRows() {
        return this.#data
    }

    viewportWidth
    viewportHeight
    screenWidth
    screenHeight
    x = 0
    y = 0

    constructor(screenWidth, screenHeight, msDelay = 1000) {

        super()
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.viewportWidth = process.stdout.columns
        this.viewportHeight = process.stdout.rows
        this.emitCurrentViewport()

        const resizeHandler = () => {
            this.viewportWidth = process.stdout.columns
            this.viewportHeight = process.stdout.rows
            this.emitCurrentViewport()
        }
        const debouncedFunction = debounce(resizeHandler, msDelay)

        process.stdout.on('resize', debouncedFunction)
        process.stdin.on('keypress', (str, key) => {
            str = ''
            if (key.sequence == '\u001b[H') {
                this.home()
            }            
            if (key.sequence == '\u001b[A') {
                this.moveUp()
            }
            if (key.sequence == '\u001b[B') {
                this.moveDown()
            }
            if (key.sequence == '\u001b[D') {
                this.moveLeft()
            }
            if (key.sequence == '\u001b[C') {
                this.moveRight()
            }
            if (key.sequence == '\x1B') {
                process.stdout.write(ansiEscapes.exitAlternativeScreen + ansiEscapes.cursorShow)
                process.exit(0)
            }
        })
        process.stdout.write(ansiEscapes.enterAlternativeScreen + ansiEscapes.clearScreen + ansiEscapes.cursorHide)
    }

    home() {
        this.x = 0
        this.y = 0
        this.emitCurrentViewport()
    }

    moveUp() {
        if (this.y > 0) {
            this.y--
            this.emitCurrentViewport()
        }
    }

    moveDown() {
        if ((this.y + this.viewportHeight) < this.screenHeight) {
            this.y++
            this.emitCurrentViewport()
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x--
            this.emitCurrentViewport()
        }
    }

    moveRight() {
        if ((this.x + this.viewportWidth) < this.screenWidth) {
            this.x++
            this.emitCurrentViewport()
        }
    }

    getCurrentViewport() {
        const viewport = {
            x: this.x,
            y: this.y,
            width: this.viewportWidth,
            height: this.viewportHeight
        }
        return viewport
    }

    emitCurrentViewport() {
        const viewport = this.getCurrentViewport()
        this.emit('viewportChange', viewport)
    }

}
export default Viewport

// const viewport = new Viewport(640, 480, 300)
// viewport.on('viewportChange', (dimensions) => {
//     dimensions = JSON.stringify(dimensions)
//     viewport.contentRows = [dimensions]
// })
