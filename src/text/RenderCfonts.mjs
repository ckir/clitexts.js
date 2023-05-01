import cfonts from 'cfonts'

class RenderCFonts {

    static #defaults = {
        font: 'block',              // define the font face
        align: 'left',              // define text alignment
        colors: ['system'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
        gradient: false,            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'                 // define the environment cfonts is being executed in
    }

    static render(text, maxOutputWidth, cfontsOptions = { space: false }) {
        cfontsOptions = {...RenderCFonts.#defaults, ...cfontsOptions}
        cfontsOptions.space = false
        let output = cfonts.render(text, cfontsOptions, false, 0, {width: maxOutputWidth}).string
        return [output]
    }

}

export { RenderCFonts }
export default RenderCFonts

// let output = RenderCFonts.render('Hello world!', 150)
// output.forEach((line) => console.log(line, '\n'))