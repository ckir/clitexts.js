import { YGLogLevel } from './enums.js';
import { YGConfig } from './ygconfig.js';
import { YGNode } from './ygnode.js';
export declare class Log {
    static log(using: YGNode | YGConfig, level: YGLogLevel, context: any, format: string, ...args: any[]): void;
}
