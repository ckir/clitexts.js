import chalk from "chalk"
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

const input = 'The quick 🌷🎁💩' + chalk.bgGrey(' 😜👍🏳️‍🌈 brown ') + chalk.red('fox jumped over ') +
    'the lazy ' + chalk.green('dog and then') + chalk.bgRedBright(' ran away with the unicorn. 💛 ')

// Themed box default values
const box1 = new Box(150, 10)
box1.on('box', (boxrows) => { // box1 will emit just once
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(2, 2, rows)
})
box1.render(input)

// A more advanced setup
const box2renderOptions = {
    type: 'figlet',
    options: {
        fontName: 'ANSI Regular',
        wordWrap: 'letter',
        textAlign: 'center'
    }
}
const box2colorOptions = {
    type: 'animation',
    options: {
        type: 'karaoke'
        // ['rainbow', 'pulse', 'glitch', 'radar', 'neon', 'karaoke']
    }
}
const box2styleOptions = { options: { vAlign: 'middle' } }
const box2boxContent = {
    renderOptions: box2renderOptions,
    colorOptions: box2colorOptions,
    styleOptions: box2styleOptions
}

const box2options = {
    boxStyle: { borderStyle: 'round', color: 'yellow' },
    boxTitle: { text: 'Box Title', options: { hAlign: 'center' } },
    boxContent: box2boxContent
}
const box2 = new Box(150, 10, box2options)
box2.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(13, 2, rows)
})
box2.render('Important')

// Lets use ttf
const box3renderOptions = {
    type: 'fonts',
    options: {
        fontFile: 'src/assets/fonts/regular/Acme 9 Regular Xtnd.ttf',
        textAlign: 'center',
        textScale: 'height'
    }
}
const box3colorOptions = {
    type: 'gradient',
    options: {
        gradient: 'rainbow'
        // ['atlas', 'cristal', 'teen', 'mind', 'morning',
        //  'vice', 'passion', 'fruit', 'instagram', 'retro',
        //  'summer', 'rainbow', 'pastel']
    }
}
const box3styleOptions = { options: { vAlign: 'middle' } }
const box3boxContent = {
    renderOptions: box3renderOptions,
    colorOptions: box3colorOptions,
    styleOptions: box3styleOptions
}

const box3options = {
    boxStyle: { borderStyle: 'round', color: 'red' },
    boxTitle: { text: 'Box Title', options: { hAlign: 'center' } },
    boxContent: box3boxContent
}

const box3 = new Box(150, 14, box3options)
box3.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(24, 2, rows)
})

setInterval(() => {
    let time = new Date().toISOString().split('T')[1].split('.')[0]
    box3.render(time)
}, 1000)

// Lets use cfonts
// While we can use any coloring method ('color' | 'gradient' | 'animation')
// for this example we will use the 'none' method and let cfonts to do the coloring
// However we have to provide the backgroundColor from our theme as shown below
const box4colorOptions = {
    type: 'none',
    options: {}
}

const box4renderOptions = {
    type: 'cfonts',
    options: {
        // console, block, simpleBlock, simple, 3d, simple3d, chrome, huge, shade, slick, grid, pallet, tiny
        font: 'slick',              // define the font face
        align: 'center',              // define text alignment
        colors: ['system'],         // define all colors
        // background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        background: themeColors.primary.background,  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
        gradient: ['red', 'blue'],            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'                 // define the environment cfonts is being executed in
    }
}
const box4styleOptions = { options: { vAlign: 'middle' } }
const box4boxContent = {
    renderOptions: box4renderOptions,
    colorOptions: box4colorOptions,
    styleOptions: box4styleOptions
}

const box4options = {
    boxStyle: { borderStyle: 'round', color: 'cyan' },
    boxTitle: { text: 'Box Title', options: { hAlign: 'center' } },
    boxContent: box4boxContent
}

const box4 = new Box(150, 14, box4options)
box4.on('box', (boxrows) => {
    const rows = boxrows.split(/\r\n|\r|\n/)
    textCanvas.draw(40, 2, rows)
})

setInterval(() => {
    let time = new Date().toISOString().split('T')[1].split('.')[0]
    box4.render(time)
}, 1000)
