import ThemeManager from "../src/themes/ThemeManager.mjs"
import TextCanvas from "../src/terminal/TextCanvas.mjs"
import Box from "../src/boxes/Box.mjs"

// Step 1 - Configure your theme
// All blessed themes are supported.
// More than 200+ themes to choose from
ThemeManager.loadTheme('Tango', 'round')
const themeColors = ThemeManager.getThemeColors()

// Step 2 - Configure your screen
// Screen dimensions can be set to any numbers you like
// You look to your screen through a movable viewport
// The viewport size is auto adjusted to the dimensions
// of your terminal. If you resize your terminal the 
// viewport auto adjust to your new terminal dimensions
const textCanvas = new TextCanvas(640, 480, { cleanValue: themeColors.primary.padCharacterRepeat })

// Step 3 - Create your boxes
// A box can have any dimensions within your screen limits
// A box can have a title 'left' 'center' or 'right' positioned
// The box frame type can be
// ['empty', 'single', 'round', 'double', 'singleDouble', 'doubleSingle', 'boldSingle', 'singleBold']
// or user provided
// You can choose any of the theme colored boxes or none to get the default
// Currently there is no way to get a custom colored box unless you write your own theme

// The box content will be rendered by one of the available renderers currently
// 'ansi', 'cfonts', 'figlet', 'fonts'
// each renderer has it's own pros and cons
// The 'ansi' renderer supports unicode characters like '💛' but the text can't be scaled
// For 'cfonts', 'figlet' renderers fonts are of fixed size depending on font used
// The 'fonts' renderer can render any ttf/otf font supported by opentype.js
// In this case text can be scaled to any size but since ttf/otf fonts are not designed
// for use in console applications most of them don't look nice especially at small sizes
// Therefore unless you are know what you are doing use the included fonts

// You can choose how your text will be fitted (wordWrap) in a box
// wordWrap can be set to 'letter', 'none', 'word'
// Text can also horizontally alligned ('left' | 'center' | 'right') and
// vertically alligned ('top' | 'middle' | 'bottom')

// There are four methods to color your text
// 'none' | 'color' | 'gradient' | 'animation'
// The 'none' method preserves any existing color formatting only for the 'ansi' renderer
// The 'animation' method emits frames at time intervals specified by each animation
// therefore can cause cpu overloading problems on low hardware systems


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
const box3options = {
    boxStyle: { borderStyle: 'round', color: 'yellow' },
    boxTitle: { text: 'Box Title', options: { hAlign: 'center' } },
    boxContent: { renderOptions: { type: 'fonts', options: {textAlign: 'center', textScale: 'height'} }, colorOptions: { type: 'gradient', options: { gradient: 'rainbow' } }, options: { vAlign: 'middle' } }
}
const box3 = new Box(150, 16, box3options)
box3.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(24, 2, rows)
})

// Step 4 - Provide data to your boxes
setInterval(() => {
    let time = new Date().toISOString().split('T')[1].split('.')[0]
    box1.render(time)
    box2.render(time+ ' 💛') // '💛' not shown unless 'ansi' renderer is used
    box3.render(time)
}, 1000)
