// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGConfig.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/YGConfig.cpp
import { YGNodeClone } from './yoga.js';
const kYGDefaultExperimentalFeatures = () => [false, false, false];
class YGConfig {
    experimentalFeatures;
    useWebDefaults;
    useLegacyStretchBehaviour;
    shouldDiffLayoutWithoutLegacyStretchBehaviour;
    printTree;
    pointScaleFactor;
    logger;
    cloneNodeCallback = null;
    context;
    constructor(logger) {
        this.experimentalFeatures = kYGDefaultExperimentalFeatures();
        this.useWebDefaults = false;
        this.useLegacyStretchBehaviour = false;
        this.shouldDiffLayoutWithoutLegacyStretchBehaviour = false;
        this.printTree = false;
        this.pointScaleFactor = 1.0;
        this.logger = logger;
        this.context = null;
    }
    log(config, node, logLevel, logContext, format, ...args) {
        this.logger(config, node, logLevel, logContext, format, ...args);
    }
    cloneNode(node, owner, childIndex, cloneContext) {
        let clone = null;
        if (this.cloneNodeCallback != null) {
            clone = this.cloneNodeCallback(node, owner, childIndex, cloneContext);
        }
        if (clone == null) {
            clone = YGNodeClone(node);
        }
        return clone;
    }
    setLogger(logger) {
        this.logger = logger;
    }
    setCloneNodeCallback(cloneNode) {
        this.cloneNodeCallback = cloneNode;
    }
}
export { YGConfig };
//# sourceMappingURL=ygconfig.js.map