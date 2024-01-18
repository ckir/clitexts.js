'use strict';
import { EventEmitter } from 'node:events'
import chalk from 'chalk';
import gradient from '../../colors/GradientString.mjs';

const glitchChars = 'x*0987654321[]0-~@#(____!!!!\\|?????....0000\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
const longHsv = { interpolation: 'hsv', hsvSpin: 'long' };

class AnimationColor extends EventEmitter {

    currentAnimation = null

    effects = {
        rainbow(str, frame) {
            const hue = 5 * frame;
            const leftColor = { h: hue % 360, s: 1, v: 1 };
            const rightColor = { h: (hue + 1) % 360, s: 1, v: 1 };
            return gradient(leftColor, rightColor)(str, longHsv);
        },
        pulse(str, frame) {
            frame = (frame % 120) + 1;
            const transition = 6;
            const duration = 10;
            const on = '#ff1010';
            const off = '#e6e6e6';

            if (frame >= (2 * transition) + duration) {
                return chalk.hex(off)(str); // All white
            }
            if (frame >= transition && frame <= transition + duration) {
                return chalk.hex(on)(str); // All red
            }

            frame = frame >= transition + duration ? (2 * transition) + duration - frame : frame; // Revert animation

            const g = frame <= transition / 2 ?
                gradient([
                    { color: off, pos: 0.5 - (frame / transition) },
                    { color: on, pos: 0.5 },
                    { color: off, pos: 0.5 + (frame / transition) }
                ]) :
                gradient([
                    { color: off, pos: 0 },
                    { color: on, pos: 1 - (frame / transition) },
                    { color: on, pos: frame / transition },
                    { color: off, pos: 1 }
                ]);

            return g(str);
        },
        glitch(str, frame) {
            if ((frame % 2) + (frame % 3) + (frame % 11) + (frame % 29) + (frame % 37) > 52) {
                return str.replace(/[^\r\n]/g, ' ');
            }

            const chunkSize = Math.max(3, Math.round(str.length * 0.02));
            const chunks = [];

            for (let i = 0, length = str.length; i < length; i++) {
                const skip = Math.round(Math.max(0, (Math.random() - 0.8) * chunkSize));
                chunks.push(str.substring(i, i + skip).replace(/[^\r\n]/g, ' '));
                i += skip;
                if (str[i]) {
                    if (str[i] !== '\n' && str[i] !== '\r' && Math.random() > 0.995) {
                        chunks.push(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
                    } else if (Math.random() > 0.005) {
                        chunks.push(str[i]);
                    }
                }
            }

            let result = chunks.join('');
            if (Math.random() > 0.99) {
                result = result.toUpperCase();
            } else if (Math.random() < 0.01) {
                result = result.toLowerCase();
            }

            return result;
        },
        radar(str, frame) {
            const depth = Math.floor(Math.min(str.length, str.length * 0.2));
            const step = Math.floor(255 / depth);

            const globalPos = frame % (str.length + depth);

            const chars = [];
            for (let i = 0, length = str.length; i < length; i++) {
                const pos = -(i - globalPos);
                if (pos > 0 && pos <= depth - 1) {
                    const shade = (depth - pos) * step;
                    chars.push(chalk.rgb(shade, shade, shade)(str[i]));
                } else {
                    chars.push(' ');
                }
            }

            return chars.join('');
        },
        neon(str, frame) {
            const color = (frame % 2 === 0) ? chalk.dim.rgb(88, 80, 85) : chalk.bold.rgb(213, 70, 242);
            return color(str);
        },
        karaoke(str, frame) {
            const chars = (frame % (str.length + 20)) - 10;
            if (chars < 0) {
                return chalk.white(str);
            }
            return chalk.rgb(255, 187, 0).bold(str.substr(0, chars)) + chalk.white(str.substr(chars));
        }
    };

    constructor(id) {
        super()
        this.id = id
    }

    log(content) {
        this.emit('textAnimation', { id: this.id, frame: content });
    }

    animateString(str, effect, delay, speed) {
        const instance = this;
        this.stopLastAnimation();

        speed = speed === undefined ? 1 : parseFloat(speed);
        if (!speed || speed <= 0) {
            throw new Error(`Expected \`speed\` to be an number greater than 0`);
        }

        this.currentAnimation = {
            text: str.split(/\r\n|\r|\n/),
            lines: str.split(/\r\n|\r|\n/).length,
            stopped: false,
            init: false,
            f: 0,
            render() {
                const self = this;
                if (!this.init) {
                    instance.log('\n'.repeat(this.lines - 1));
                    this.init = true;
                }
                instance.log(this.frame());
                setTimeout(() => {
                    if (!self.stopped) {
                        self.render();
                    }
                }, delay / speed);
            },
            frame() {
                this.f++;
                return '\u001B[' + this.lines + 'F\u001B[G\u001B[2K' + this.text.map(str => effect(str, this.f)).join('\n');
            },
            replace(str) {
                this.text = str.split(/\r\n|\r|\n/);
                this.lines = str.split(/\r\n|\r|\n/).length;
                return this;
            },
            stop() {
                this.stopped = true;
                return this;
            },
            start() {
                this.stopped = false;
                this.render();
                return this;
            }
        };
        setTimeout(() => {
            if (!this.currentAnimation.stopped) {
                this.currentAnimation.start();
            }
        }, delay / speed);
        return this.currentAnimation;
    }

    stopLastAnimation() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
    }

    rainbow(str, speed) {
        return (this.animateString(str, this.effects.rainbow, 15, speed).stop())
    }

    pulse(str, speed) {
        return (this.animateString(str, this.effects.pulse, 16, speed).stop())
    }

    glitch(str, speed) {
        return (this.animateString(str, this.effects.glitch, 55, speed).stop())
    }

    radar(str, speed) {
        return (this.animateString(str, this.effects.radar, 50, speed).stop())
    }

    neon(str, speed) {
        return (this.animateString(str, this.effects.neon, 500, speed).stop())
    }

    karaoke(str, speed) {
        return (this.animateString(str, this.effects.karaoke, 50, speed).stop())
    }

} // AnimationColor

export { AnimationColor }
export default AnimationColor

// let an = new TextAnimation()
// an.on('textAnimation', (content) => {
//     console.log(content)
// })
// let rb = an.rainbow('The quick brown fox\n jumps over the lazy dog')
// rb.start()
