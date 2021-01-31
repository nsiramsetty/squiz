"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
const __1 = __importDefault(require(".."));
class MySqlService {
    static getConnectionPool() {
        if (this.pool) {
            return this.pool;
        }
        const configProp = Object.assign(Object.assign({}, __1.default.search.mySqlConfig), { user: process.env.MYSQL_DB_USER, host: process.env.MYSQL_DB_HOST, password: process.env.MYSQL_DB_PASSWORD, database: process.env.MYSQL_DB_DATABASE });
        this.pool = mysql.createPool(configProp);
        return this.pool;
    }
}
exports.default = MySqlService;
//# sourceMappingURL=mysql.service.js.map