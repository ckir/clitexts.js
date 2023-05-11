type TokenPositionFrom = number;
type TokenPositionTo = number;
type TokenIndex = number;
type TokenType = string;
type TokenValue = string;
type TokenPosition = [TokenPositionFrom, TokenPositionTo];
type KnownRegexPatterns = TokenizeLetter | TokenizeMark | TokenizeSeparator | TokenizeSymbol | TokenizeNumber | TokenizePunctuation | TokenizeOther | TokenizeWord;
type TokenizerRule = Record<TokenType, KnownRegexPatterns | RegExp>;
interface PositionalTokenizer {
    tokenize: (text: string) => Token[];
    update: (rules: TokenizerBakedRule[]) => PositionalTokenizer;
}
type TokenJSON = {
    index: TokenIndex;
    type: TokenType;
    value: TokenValue;
    position: TokenPosition;
};
declare enum TokenizeLetter {
    ALL = "L",
    LOWERCASE = "Ll",
    UPPERCASE = "Lu",
    TITLECASE = "Lt",
    CASED = "L&",
    OTHER = "Lm",
    MODIFIER = "Lo"
}
declare enum TokenizeMark {
    ALL = "M",
    NON_SPACING = "Mn",
    SPACING_COMBINING = "Mc",
    ENCLOSING = "Me"
}
declare enum TokenizeSeparator {
    ALL = "Z",
    SPACE = "Zs",
    LINE = "Zl",
    PARAGRAPH = "Zp"
}
declare enum TokenizeSymbol {
    ALL = "S",
    MATH = "Sm",
    CURRENCY = "Sc",
    MODIFIER = "Sk",
    OTHER = "So"
}
declare enum TokenizeNumber {
    ALL = "N",
    DECIMAL_DIGIT = "Nd",
    LETTER = "Nl",
    OTHER = "No"
}
declare enum TokenizePunctuation {
    ALL = "P",
    DASH = "Pd",
    OPEN = "Ps",
    CLOSE = "Pe",
    INITIAL = "Pi",
    FINAL = "Pf",
    CONNECTOR = "Pc",
    OTHER = "Po"
}
declare enum TokenizeOther {
    ALL = "C",
    CONTROL = "Cc",
    FORMAT = "Cf",
    SURROGATE = "Cs",
    PRIVATE_USE = "Co",
    UNASSIGNED = "Cn"
}
declare enum TokenizeWord {
    SIMPLE = "L",
    COMPLEX = "[\\p{L}\\p{Pd}']"
}
export declare class Token {
    private readonly i;
    private readonly t;
    private readonly v;
    private readonly p;
    constructor(i: TokenIndex, type: TokenType, value: TokenValue, position: TokenPosition);
    get index(): TokenIndex;
    get type(): TokenType;
    get value(): TokenValue;
    get position(): TokenPosition;
    toString(): string;
    toJSON(): TokenJSON;
}
declare class TokenizerBakedRule {
    r: RegExp;
    t: TokenType;
    m: boolean;
    constructor(rule: TokenizerRule, captureMulti?: boolean);
    private static toRegex;
    get regex(): RegExp;
    get type(): TokenType;
    get shouldCaptureMulti(): boolean;
}
export declare class Tokenizer implements PositionalTokenizer {
    private r;
    constructor(rules?: Array<TokenizerBakedRule | null>);
    private get rules();
    private static isString;
    private static getDefaultRules;
    static ruleMono(rule: TokenizerRule): TokenizerBakedRule | null;
    static ruleMulti(rule: TokenizerRule): TokenizerBakedRule | null;
    update(rules: Array<TokenizerBakedRule | null>): PositionalTokenizer;
    tokenize(text: string): Token[];
}
export { TokenizeLetter, TokenizeSeparator, TokenizeMark, TokenizeOther, TokenizeNumber, TokenizeSymbol, TokenizePunctuation, TokenizeWord };
