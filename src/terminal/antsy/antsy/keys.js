export var Modifier;
(function (Modifier) {
    Modifier[Modifier["None"] = 0] = "None";
    Modifier[Modifier["Shift"] = 1] = "Shift";
    Modifier[Modifier["Alt"] = 2] = "Alt";
    Modifier[Modifier["Control"] = 4] = "Control";
    Modifier[Modifier["Meta"] = 8] = "Meta";
})(Modifier || (Modifier = {}));
export var KeyType;
(function (KeyType) {
    KeyType[KeyType["Normal"] = 0] = "Normal";
    KeyType[KeyType["Function"] = 1] = "Function";
    KeyType[KeyType["PasteBegin"] = 2] = "PasteBegin";
    KeyType[KeyType["PasteEnd"] = 3] = "PasteEnd";
    KeyType[KeyType["Backspace"] = 4] = "Backspace";
    KeyType[KeyType["Up"] = 5] = "Up";
    KeyType[KeyType["Down"] = 6] = "Down";
    KeyType[KeyType["Left"] = 7] = "Left";
    KeyType[KeyType["Right"] = 8] = "Right";
    KeyType[KeyType["PageUp"] = 9] = "PageUp";
    KeyType[KeyType["PageDown"] = 10] = "PageDown";
    KeyType[KeyType["Insert"] = 11] = "Insert";
    KeyType[KeyType["Delete"] = 12] = "Delete";
    KeyType[KeyType["Home"] = 13] = "Home";
    KeyType[KeyType["End"] = 14] = "End";
    KeyType[KeyType["Esc"] = 15] = "Esc";
    KeyType[KeyType["Tab"] = 16] = "Tab";
    KeyType[KeyType["Return"] = 17] = "Return";
})(KeyType || (KeyType = {}));
export class Key {
    modifiers;
    type;
    key;
    constructor(modifiers, type, key = "") {
        this.modifiers = modifiers;
        this.type = type;
        this.key = key;
        // pass
    }
    static normal(modifiers, key) {
        return new Key(modifiers, KeyType.Normal, key);
    }
    equals(other) {
        return this.modifiers == other.modifiers && this.type == other.type && this.key == other.key;
    }
    toString() {
        const segments = [];
        if ((this.modifiers & (Modifier.Meta | Modifier.Alt)) != 0)
            segments.push("M");
        if (this.modifiers & Modifier.Shift)
            segments.push("S");
        if (this.modifiers & Modifier.Control)
            segments.push("C");
        switch (this.type) {
            case KeyType.Normal:
                segments.push(this.key);
                break;
            case KeyType.Function:
                segments.push(`F${this.key}`);
                break;
            case KeyType.PasteBegin:
                segments.push("Paste");
                break;
            case KeyType.PasteEnd:
                segments.push("/Paste");
                break;
            default:
                segments.push(KeyType[this.type]);
                break;
        }
        return segments.join("-");
    }
}
var State;
(function (State) {
    State[State["Normal"] = 0] = "Normal";
    State[State["Esc"] = 1] = "Esc";
    State[State["CSI"] = 2] = "CSI";
    State[State["SS3"] = 3] = "SS3";
})(State || (State = {}));
var Ascii;
(function (Ascii) {
    Ascii[Ascii["BACKSPACE"] = 8] = "BACKSPACE";
    Ascii[Ascii["TAB"] = 9] = "TAB";
    Ascii[Ascii["CR"] = 13] = "CR";
    Ascii[Ascii["ESC"] = 27] = "ESC";
    Ascii[Ascii["ZERO"] = "0".codePointAt(0) || 0] = "ZERO";
    Ascii[Ascii["SEMICOLON"] = ";".codePointAt(0) || 0] = "SEMICOLON";
    Ascii[Ascii["O"] = "O".codePointAt(0) || 0] = "O";
    Ascii[Ascii["P"] = "P".codePointAt(0) || 0] = "P";
    Ascii[Ascii["S"] = "S".codePointAt(0) || 0] = "S";
    Ascii[Ascii["LBRACKET"] = "[".codePointAt(0) || 0] = "LBRACKET";
    Ascii[Ascii["SQUIGGLE"] = "~".codePointAt(0) || 0] = "SQUIGGLE";
    Ascii[Ascii["DEL"] = 127] = "DEL";
})(Ascii || (Ascii = {}));
const ESC_TIMEOUT = 100;
// parse incoming xterm-encoded keypresses and emit decoded keys
export class KeyParser {
    state = State.Normal;
    modifiers = Modifier.None;
    buffer = "";
    lastKey = Date.now();
    // async iterator state: queued keys or waiting reader
    queue = [];
    resolve;
    ended = false;
    receiver;
    receiverRunning = false;
    [Symbol.asyncIterator]() {
        return this;
    }
    next() {
        return new Promise(resolve => {
            this.resolve = resolve;
            this.wake();
        });
    }
    // check if we should hand out keys to a waiting reader
    wake() {
        if (this.receiver && !this.receiverRunning) {
            this.receiverRunning = true;
            setTimeout(async () => {
                while (this.queue.length > 0 && this.receiver)
                    await this.receiver(this.queue.shift());
                this.receiverRunning = false;
            }, 0);
            return;
        }
        if (!this.resolve || (!this.ended && this.queue.length == 0))
            return;
        const resolve = this.resolve;
        this.resolve = undefined;
        const value = this.queue.shift();
        resolve({ done: this.ended, value });
    }
    end() {
        this.ended = true;
        this.wake();
    }
    pipe(receiver) {
        this.receiver = receiver;
    }
    unpipe() {
        this.receiver = undefined;
    }
    feed(s) {
        let checkMeta = false;
        for (let c of Array.from(s).map(s => s.codePointAt(0) || 0)) {
            checkMeta = this.feedCodepoint(c);
        }
        this.lastKey = Date.now();
        this.wake();
        if (checkMeta) {
            setTimeout(() => {
                if (Date.now() - this.lastKey >= ESC_TIMEOUT) {
                    // dangling ESC, maybe it was just ESC...
                    this.queue.push(new Key(this.modifiers, KeyType.Esc));
                    this.state = State.Normal;
                    this.wake();
                }
            }, ESC_TIMEOUT);
        }
    }
    // returns true if it processed a dangling ESC
    feedCodepoint(c) {
        switch (this.state) {
            case State.Normal:
                switch (c) {
                    case Ascii.TAB:
                        this.queue.push(new Key(this.modifiers, KeyType.Tab));
                        this.modifiers = 0;
                        return false;
                    case Ascii.CR:
                        this.queue.push(new Key(this.modifiers, KeyType.Return));
                        this.modifiers = 0;
                        return false;
                    case Ascii.ESC:
                        this.state = State.Esc;
                        return true;
                    case Ascii.BACKSPACE:
                    case Ascii.DEL:
                        this.queue.push(new Key(this.modifiers, KeyType.Backspace));
                        this.modifiers = 0;
                        return false;
                    default:
                        if (c < 32) {
                            // control codes!
                            this.modifiers |= Modifier.Control;
                            c += 64;
                        }
                        this.queue.push(new Key(this.modifiers, KeyType.Normal, String.fromCodePoint(c)));
                        this.modifiers = 0;
                        return false;
                }
            case State.Esc:
                switch (c) {
                    case Ascii.LBRACKET:
                        this.state = State.CSI;
                        this.buffer = "";
                        return false;
                    case Ascii.O:
                        this.state = State.SS3;
                        return false;
                    default:
                        // well crap. assume they meant meta.
                        this.modifiers |= Modifier.Meta;
                        this.state = State.Normal;
                        return this.feedCodepoint(c);
                }
            case State.CSI:
                if (c >= Ascii.ZERO && c <= Ascii.SEMICOLON) {
                    this.buffer += String.fromCodePoint(c);
                    return false;
                }
                this.parseCsi(String.fromCodePoint(c), this.buffer.split(/[;:]/).map(s => parseInt(s, 10)));
                this.state = State.Normal;
                this.modifiers = 0;
                return false;
            case State.SS3:
                if (c >= Ascii.P && c <= Ascii.S) {
                    this.queue.push(new Key(this.modifiers, KeyType.Function, (1 + c - Ascii.P).toString()));
                    this.state = State.Normal;
                    this.modifiers = 0;
                    return false;
                }
                else {
                    // what is ESC O (something)? we don't support it.
                    this.queue.push(new Key(Modifier.Meta, KeyType.Normal, "O"));
                    this.state = State.Normal;
                    return this.feedCodepoint(c);
                }
        }
    }
    parseCsi(command, args) {
        if (args[0] == 1 && args.length >= 2)
            this.modifiers |= (args[1] - 1);
        switch (command) {
            case "A":
                this.queue.push(new Key(this.modifiers, KeyType.Up));
                break;
            case "B":
                this.queue.push(new Key(this.modifiers, KeyType.Down));
                break;
            case "C":
                this.queue.push(new Key(this.modifiers, KeyType.Right));
                break;
            case "D":
                this.queue.push(new Key(this.modifiers, KeyType.Left));
                break;
            case "H":
                this.queue.push(new Key(this.modifiers, KeyType.Home));
                break;
            case "F":
                this.queue.push(new Key(this.modifiers, KeyType.End));
                break;
            case "P":
                this.queue.push(new Key(this.modifiers, KeyType.Function, "1"));
                break;
            case "Q":
                this.queue.push(new Key(this.modifiers, KeyType.Function, "2"));
                break;
            case "R":
                this.queue.push(new Key(this.modifiers, KeyType.Function, "3"));
                break;
            case "S":
                this.queue.push(new Key(this.modifiers, KeyType.Function, "4"));
                break;
            case "Z":
                // xterm sends a special code for shift-tab!
                this.queue.push(new Key(Modifier.Shift, KeyType.Tab));
                break;
            case "~": {
                if (args.length > 1)
                    this.modifiers = this.modifiers |= (args[1] - 1);
                switch (args[0] || 0) {
                    case 1:
                        this.queue.push(new Key(this.modifiers, KeyType.Home));
                        break;
                    case 2:
                        this.queue.push(new Key(this.modifiers, KeyType.Insert));
                        break;
                    case 3:
                        this.queue.push(new Key(this.modifiers, KeyType.Delete));
                        break;
                    case 4:
                        this.queue.push(new Key(this.modifiers, KeyType.End));
                        break;
                    case 5:
                        this.queue.push(new Key(this.modifiers, KeyType.PageUp));
                        break;
                    case 6:
                        this.queue.push(new Key(this.modifiers, KeyType.PageDown));
                        break;
                    case 11:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "1"));
                        break;
                    case 12:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "2"));
                        break;
                    case 13:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "3"));
                        break;
                    case 14:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "4"));
                        break;
                    case 15:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "5"));
                        break;
                    // what happened to 16?
                    case 17:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "6"));
                        break;
                    case 18:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "7"));
                        break;
                    case 19:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "8"));
                        break;
                    case 20:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "9"));
                        break;
                    case 21:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "10"));
                        break;
                    // what happened to 22?
                    case 23:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "11"));
                        break;
                    case 24:
                        this.queue.push(new Key(this.modifiers, KeyType.Function, "12"));
                        break;
                    case 200:
                        this.queue.push(new Key(this.modifiers, KeyType.PasteBegin));
                        break;
                    case 201:
                        this.queue.push(new Key(this.modifiers, KeyType.PasteEnd));
                        break;
                }
                break;
            }
            default:
                // well crap. CSI + garbage?
                this.queue.push(new Key(Modifier.Meta, KeyType.Normal, "["));
                this.queue.push(new Key(0, KeyType.Normal, command));
                break;
        }
    }
}
//# sourceMappingURL=keys.js.map