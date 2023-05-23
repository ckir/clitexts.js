export declare enum Modifier {
    None = 0,
    Shift = 1,
    Alt = 2,
    Control = 4,
    Meta = 8
}
export declare enum KeyType {
    Normal = 0,
    Function = 1,
    PasteBegin = 2,
    PasteEnd = 3,
    Backspace = 4,
    Up = 5,
    Down = 6,
    Left = 7,
    Right = 8,
    PageUp = 9,
    PageDown = 10,
    Insert = 11,
    Delete = 12,
    Home = 13,
    End = 14,
    Esc = 15,
    Tab = 16,
    Return = 17
}
export declare class Key {
    modifiers: Modifier;
    type: KeyType;
    key: string;
    constructor(modifiers: Modifier, type: KeyType, key?: string);
    static normal(modifiers: Modifier, key: string): Key;
    equals(other: Key): boolean;
    toString(): string;
}
declare enum State {
    Normal = 0,
    Esc = 1,
    CSI = 2,
    SS3 = 3
}
export declare class KeyParser implements AsyncIterator<Key>, AsyncIterable<Key> {
    state: State;
    modifiers: Modifier;
    buffer: string;
    lastKey: number;
    queue: Key[];
    resolve: ((value: IteratorResult<Key>) => void) | undefined;
    ended: boolean;
    receiver: ((key: Key) => Promise<void>) | undefined;
    receiverRunning: boolean;
    [Symbol.asyncIterator](): this;
    next(): Promise<IteratorResult<Key>>;
    private wake;
    end(): void;
    pipe(receiver: (key: Key) => Promise<void>): void;
    unpipe(): void;
    feed(s: string): void;
    feedCodepoint(c: number): boolean;
    parseCsi(command: string, args: number[]): void;
}
export {};
