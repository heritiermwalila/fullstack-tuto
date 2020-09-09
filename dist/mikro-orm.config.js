"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Post_1 = __importDefault(require("./entities/Post"));
const User_1 = __importDefault(require("./entities/User"));
exports.default = {
    migrations: {
        path: path_1.join(__dirname, 'migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post_1.default, User_1.default],
    dbName: 'lireddit',
    user: 'heritier',
    password: 'chenani91@',
    type: 'mysql',
    debug: true
};
//# sourceMappingURL=mikro-orm.config.js.map