"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Posts_1 = require("./entities/Posts");
const constants_1 = require("./constants");
const path_1 = require("path");
exports.default = {
    migrations: {
        path: path_1.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Posts_1.Post],
    dbName: 'lireddit',
    user: 'heritier',
    password: 'chenani91@',
    type: 'mysql',
    debug: !constants_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map