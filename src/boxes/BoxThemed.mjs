import BoxAbstract from './BoxAbstract.mjs'
import ThemeManager from '../themes/ThemeManager.mjs'

class BoxThemed extends BoxAbstract{

    #defaultsBoxThemed = {
        themeName: 'Default.dark'
    }

    constructor(boxOptions = {}) {

        super(boxOptions)
        boxOptions = {...this.#defaultsBoxThemed, ...boxOptions}
        const themes = new ThemeManager(boxOptions.themeName, this.borderCharacters)
        this.boxes = themes.getThemedBoxes()

    }    

}

// const opt = {
//     borderStyle: 'single',
//     themeName: 'Darkside'

// }
// let a = new BoxThemed(opt)