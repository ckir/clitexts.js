import { YGLogLevel } from './enums.js';
import { YGNode } from './ygnode.js';
import { YGLogger, YGCloneNodeFunc } from './yoga.js';
declare class YGConfig {
    experimentalFeatures: Array<boolean>;
    useWebDefaults: boolean;
    useLegacyStretchBehaviour: boolean;
    shouldDiffLayoutWithoutLegacyStretchBehaviour: boolean;
    printTree: boolean;
    pointScaleFactor: number;
    logger: YGLogger;
    cloneNodeCallback: YGCloneNodeFunc;
    context: any;
    constructor(logger: YGLogger);
    log(config: YGConfig, node: YGNode, logLevel: YGLogLevel, logContext: any, format: string, ...args: any[]): void;
    cloneNode(node: YGNode, owner: YGNode, childIndex: number, cloneContext?: any): YGNode;
    setLogger(logger?: YGLogger): void;
    setCloneNodeCallback(cloneNode?: YGCloneNodeFunc): void;
}
export { YGConfig };
