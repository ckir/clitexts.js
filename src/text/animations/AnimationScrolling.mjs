import { EventEmitter } from 'node:events'
import sliceAnsi from '../lib/AnsiSlice.mjs'
import AnsiSplitter from '../lib/AnsiSplitter.mjs'

class AnimationScrolling extends EventEmitter {

    constructor(id, row, options = { width: process.stdout.columns, frameDelay: 100 }) {
        
        super()
        
        this.row = row
        this.id = id
        this.rendered = row.rendered.map(line => { 
            const splitter = new AnsiSplitter(line)
            return splitter.toColoredGraphemes(false)
        })

        this.width = options.width
        this.frameDelay = options.frameDelay // Adjust as needed

    }

    startScrolling() {

        if (this.isScrolling) {
            return; // Animation is already running
        }

        const scrollFrame = () => {

            const arrayRotate = (arr, reverse) => {
                if (reverse) arr.unshift(arr.pop())
                else arr.push(arr.shift())
                return arr
            }
    
            const lines = this.rendered.map(line => line.join(''))
            let frame = lines.map(line => sliceAnsi(line, 0, this.width))
            this.emit('textAnimation', { [this.id]: { text: this.row.text, rendered: frame } });

            this.rendered = this.rendered.map(line => arrayRotate(line))

            if (this.isScrolling) {
                setTimeout(scrollFrame, this.frameDelay);
            }
        };

        this.isScrolling = true;
        scrollFrame();

    } // startScrolling

    stopScrolling() {
        this.isScrolling = false;
    } // stopScrolling

} // AnimationScrolling

export { AnimationScrolling }
export default AnimationScrolling


// const text = `
//  _   _      _ _        __        __         _     _
// | | | | ___| | | ___   \ \      / /__  _ __| | __| |
// | |_| |/ _ \ | |/ _ \   \ \ /\ / / _ \| '__| |/ _\` |
// |  _  |  __/ | | (_) |   \ V  V / (_) | |  | | (_| |
// |_| |_|\___|_|_|\___/     \_/\_/ \___/|_|  |_|\__,_|
// `
// const row = {text: 'Hello World', rendered: text.split('\n').map(line => line.padEnd(process.stdout.columns, ' '))}
// const animationScrolling = new AnimationScrolling(0, row)

// animationScrolling.on('textAnimation', frame => {
//     process.stdout.write('\x1Bc') // Clear the terminal
//     process.stdout.write(frame[0].rendered.join('\n'))
// })

// animationScrolling.startScrolling()
