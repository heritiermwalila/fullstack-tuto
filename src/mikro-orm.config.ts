import { Post } from "./entities/Posts"
import { __prod__ } from "./constants"
import { MikroORM } from "@mikro-orm/core"
import {join} from 'path'

export default {
        migrations:{
            path: join(__dirname, './migrations'), // path to the folder with migrations
            pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
        },
        entities:[Post],
        dbName: 'lireddit',
        user:'heritier',
        password:'chenani91@',
        type: 'mysql',
        debug: !__prod__,
    
} as Parameters<typeof MikroORM.init>[0];