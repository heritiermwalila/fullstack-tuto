import {MikroORM} from '@mikro-orm/core'
import { __prod__ } from './constants'
import { Post } from './entities/Posts'
import config from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(config)

    const post = orm.em.create(Post, {title: 'My first post'})
    await orm.em.persistAndFlush(post)

}

main()