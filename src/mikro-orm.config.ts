import { MikroORM } from "@mikro-orm/core";
import {join} from 'path'
import Post from "./entities/Post";
import User from "./entities/User";

export default {
    migrations: {
        path: join(__dirname, 'migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post, User],
    dbName: 'lireddit',
    user: 'heritier',
    password: 'chenani91@',
    type:'mysql',
    debug: true
} as Parameters<typeof MikroORM.init>[0]
