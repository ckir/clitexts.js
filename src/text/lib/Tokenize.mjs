// https://github.com/ckir/positional-tokenizer
var TokenizeLetter;
(function (TokenizeLetter) {
    TokenizeLetter["ALL"] = "L";
    TokenizeLetter["LOWERCASE"] = "Ll";
    TokenizeLetter["UPPERCASE"] = "Lu";
    TokenizeLetter["TITLECASE"] = "Lt";
    TokenizeLetter["CASED"] = "L&";
    TokenizeLetter["OTHER"] = "Lm";
    TokenizeLetter["MODIFIER"] = "Lo";
})(TokenizeLetter || (TokenizeLetter = {}));
var TokenizeMark;
(function (TokenizeMark) {
    TokenizeMark["ALL"] = "M";
    TokenizeMark["NON_SPACING"] = "Mn";
    TokenizeMark["SPACING_COMBINING"] = "Mc";
    TokenizeMark["ENCLOSING"] = "Me";
})(TokenizeMark || (TokenizeMark = {}));
var TokenizeSeparator;
(function (TokenizeSeparator) {
    TokenizeSeparator["ALL"] = "Z";
    TokenizeSeparator["SPACE"] = "Zs";
    TokenizeSeparator["LINE"] = "Zl";
    TokenizeSeparator["PARAGRAPH"] = "Zp";
})(TokenizeSeparator || (TokenizeSeparator = {}));
var TokenizeSymbol;
(function (TokenizeSymbol) {
    TokenizeSymbol["ALL"] = "S";
    TokenizeSymbol["MATH"] = "Sm";
    TokenizeSymbol["CURRENCY"] = "Sc";
    TokenizeSymbol["MODIFIER"] = "Sk";
    TokenizeSymbol["OTHER"] = "So";
})(TokenizeSymbol || (TokenizeSymbol = {}));
var TokenizeNumber;
(function (TokenizeNumber) {
    TokenizeNumber["ALL"] = "N";
    TokenizeNumber["DECIMAL_DIGIT"] = "Nd";
    TokenizeNumber["LETTER"] = "Nl";
    TokenizeNumber["OTHER"] = "No";
})(TokenizeNumber || (TokenizeNumber = {}));
var TokenizePunctuation;
(function (TokenizePunctuation) {
    TokenizePunctuation["ALL"] = "P";
    TokenizePunctuation["DASH"] = "Pd";
    TokenizePunctuation["OPEN"] = "Ps";
    TokenizePunctuation["CLOSE"] = "Pe";
    TokenizePunctuation["INITIAL"] = "Pi";
    TokenizePunctuation["FINAL"] = "Pf";
    TokenizePunctuation["CONNECTOR"] = "Pc";
    TokenizePunctuation["OTHER"] = "Po";
})(TokenizePunctuation || (TokenizePunctuation = {}));
var TokenizeOther;
(function (TokenizeOther) {
    TokenizeOther["ALL"] = "C";
    TokenizeOther["CONTROL"] = "Cc";
    TokenizeOther["FORMAT"] = "Cf";
    TokenizeOther["SURROGATE"] = "Cs";
    TokenizeOther["PRIVATE_USE"] = "Co";
    TokenizeOther["UNASSIGNED"] = "Cn";
})(TokenizeOther || (TokenizeOther = {}));
var TokenizeWord;
(function (TokenizeWord) {
    TokenizeWord["SIMPLE"] = "L";
    TokenizeWord["COMPLEX"] = "[\\p{L}\\p{Pd}']";
})(TokenizeWord || (TokenizeWord = {}));
export class Token {
    i;
    t;
    v;
    p;
    constructor(i, type, value, position) {
        this.i = i;
        this.t = type;
        this.v = value;
        this.p = position;
    }
    get index() {
        return this.i;
    }
    ;
    get type() {
        return this.t;
    }
    ;
    get value() {
        return this.v;
    }
    ;
    get position() {
        return this.p;
    }
    ;
    toString() {
        return `${this.v}`;
    }
    toJSON() {
        return {
            index: this.i,
            type: this.t,
            value: this.v,
            position: this.p
        };
    }
}
class TokenizerBakedRule {
    r;
    t;
    m;
    constructor(rule, captureMulti) {
        const keys = Object.keys(rule);
        if (!keys.length)
            throw new Error("Omitting the rule that has no type");
        const ruleType = keys[0];
        const regex = rule[ruleType];
        if (!regex)
            throw new Error("Omitting the rule that has no value");
        this.t = ruleType;
        this.r = TokenizerBakedRule.toRegex(regex);
        this.m = captureMulti || false;
    }
    static toRegex = (regex) => {
        if (regex instanceof RegExp)
            return regex;
        const pattern = regex === TokenizeWord.COMPLEX ? TokenizeWord.COMPLEX : `\\p{${regex}}`;
        return new RegExp(pattern, "u");
    };
    get regex() {
        return this.r;
    }
    ;
    get type() {
        return this.t;
    }
    ;
    get shouldCaptureMulti() {
        return this.m;
    }
    ;
}
export class Tokenizer {
    r;
    constructor(rules) {
        const rulesToApply = rules || Tokenizer.getDefaultRules();
        this.r = rulesToApply.filter(r => Boolean(r));
    }
    get rules() {
        return this.r;
    }
    static isString(text) {
        return typeof text === 'string' || text instanceof String;
    }
    static getDefaultRules() {
        return [
            Tokenizer.ruleMulti({ word: TokenizeLetter.ALL }),
            Tokenizer.ruleMono({ space: TokenizeSeparator.ALL }),
            Tokenizer.ruleMono({ punctuation: TokenizePunctuation.ALL }),
            Tokenizer.ruleMulti({ number: TokenizeNumber.ALL }),
            Tokenizer.ruleMulti({ symbol: TokenizeSymbol.ALL })
        ];
    }
    static ruleMono(rule) {
        try {
            return new TokenizerBakedRule(rule);
        }
        catch (e) {
            console.warn(e);
            return null;
        }
    }
    static ruleMulti(rule) {
        try {
            return new TokenizerBakedRule(rule, true);
        }
        catch (e) {
            console.warn(e);
            return null;
        }
    }
    update(rules) {
        this.r = rules.filter(r => Boolean(r));
        return this;
    }
    tokenize(text) {
        if (!Tokenizer.isString(text)) {
            return [];
        }
        const tokens = [];
        const size = text.length;
        const rulesAmount = this.rules.length;
        for (let cursor = 0; cursor < size; cursor++) {
            const char = text[cursor];
            for (let i = 0; i < rulesAmount; i++) {
                const rule = this.rules[i];
                if (rule.regex.test(char)) {
                    let value = char;
                    let position = [cursor, cursor + 1];
                    const type = rule.type;
                    if (rule.shouldCaptureMulti) {
                        let end = cursor + 1;
                        while (end < size) {
                            const nextChar = text[end];
                            if (rule.regex.test(nextChar)) {
                                value += nextChar;
                                end++;
                            }
                            else {
                                break;
                            }
                        }
                        position = [cursor, end];
                        cursor = end - 1;
                    }
                    tokens.push(new Token(tokens.length, type, value, position));
                    break;
                }
            }
        }
        return tokens;
    }
}
export { TokenizeLetter, TokenizeSeparator, TokenizeMark, TokenizeOther, TokenizeNumber, TokenizeSymbol, TokenizePunctuation, TokenizeWord };
