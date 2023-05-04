import ThemeManager from "../src/themes/ThemeManager.mjs"
import TextCanvas from "../src/terminal/TextCanvas.mjs"
import Box from "../src/boxes/Box.mjs"

// Step 1 - Configure your theme
ThemeManager.loadTheme('Dracula', 'round')
const themeColors = ThemeManager.getThemeColors()

// Step 2 - Configure your screen
const textCanvas = new TextCanvas(640, 480, { cleanValue: themeColors.primary.padCharacterRepeat })

// Step 3 - Create your boxes
const box1 = new Box(150, 10)
box1.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(2, 2, rows)
})
const box2 = new Box(150, 10, {boxStyle:{color: 'red'}})
box2.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(13, 2, rows)
})
const box3 = new Box(150, 10, {boxStyle:{color: 'yellow'}})
box3.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(24, 2, rows)
})

// Step 4 - Provide data to boxes
setInterval(() => {
    let time = new Date().toISOString().split('T')[1]
    box1.render(time, 148)
    box2.render(time, 148)
    box3.render(time + ' 💛', 148)
}, 1000)
