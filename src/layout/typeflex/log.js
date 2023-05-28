// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/log.h
// upstream: https://github.com/facebook/yoga/blob/v1.19.0/yoga/log.cpp
import { YGConfig } from './ygconfig.js';
import { YGNode } from './ygnode.js';
import { YGConfigGetDefault } from './yoga.js';
function vlog(config, node, level, context, format, ...args) {
    const logConfig = config != null ? config : YGConfigGetDefault();
    logConfig.log(logConfig, node, level, context, format, ...args);
}
export class Log {
    static log(using, level, context, format, ...args) {
        if (using instanceof YGNode) {
            const node = using;
            vlog(node == null ? null : node.getConfig(), node, level, context, format, args);
        }
        else if (using instanceof YGConfig) {
            const config = using;
            vlog(config, null, level, context, format, args);
        }
    }
}
//# sourceMappingURL=log.js.map