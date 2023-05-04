import ThemeManager from "../src/themes/ThemeManager.mjs"
import TextCanvas from "../src/terminal/TextCanvas.mjs"
import Box from "../src/boxes/Box.mjs"


const themeManager = new ThemeManager('Dracula', 'round')
const themeColors = themeManager.getThemeColors()
const textCanvas = new TextCanvas(640, 480, { cleanValue: themeColors.primary.padCharacterRepeat })
const box1 = new Box(themeManager, 150, 10)
box1.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(2, 2, rows)
})
const box2 = new Box(themeManager, 150, 10)
box2.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(13, 2, rows)
})
setInterval(() => {
    let time = new Date().toISOString().split('T')[1]
    box1.render(time, 148)
    box2.render(time, 148)
}, 1000)
