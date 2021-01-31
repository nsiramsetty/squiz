"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORRELATION_NAMESPACE = void 0;
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const shortid_1 = __importDefault(require("shortid"));
exports.CORRELATION_NAMESPACE = 'CORRELATION';
function correlation(namespace) {
    if (!namespace)
        throw new Error('CLS namespace required');
    return function clsfyMiddleware(req, res, next) {
        namespace.bindEmitter(req);
        namespace.bindEmitter(res);
        namespace.run(() => {
            const correlationID = shortid_1.default.generate();
            cls_hooked_1.default.getNamespace(exports.CORRELATION_NAMESPACE).set('correlationID', correlationID);
            next();
        });
    };
}
exports.default = correlation;
//# sourceMappingURL=correlation.handler.js.map