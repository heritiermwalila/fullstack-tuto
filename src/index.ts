import 'reflect-metadata'
import {MikroORM} from '@mikro-orm/core'
import config from './mikro-orm.config'
import Post from './entities/Post'

import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'

const main = async () => {
    
    const orm = await MikroORM.init(config)
    await orm.getMigrator().up()

    const app = express()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    })

    apolloServer.applyMiddleware({app})

    app.listen(4000, () => {
        console.log('server running on localhost:4000');
        
    })

    // const post = orm.em.create(Post, {title: 'Hello my first post'})
    // console.log(post);
    
    // await orm.em.persistAndFlush(post)
    const posts = await orm.em.find(Post, {})
    console.log(posts);
    

}

main().catch(err=>{
    console.log(err);
    
})