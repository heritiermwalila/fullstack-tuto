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

import redis from 'redis'
import session from 'express-session'
import cors from 'cors'
import connectRedis from 'connect-redis'
import { __prod__ } from './constants'

let RedisStore = connectRedis(session)
let redisClient = redis.createClient()


const main = async () => {
    
    const orm = await MikroORM.init(config)
    await orm.getMigrator().up()

    const app = express()

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials:true,
        
    }))
    app.use(
        session({
          name: 'qid',
          store: new RedisStore({ client: redisClient, disableTouch: true}),
          cookie:{
              maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
              httpOnly: true,
              secure: __prod__,
              sameSite: 'lax'
          },
          saveUninitialized: false,
          secret: 'mysecretkey',
          resave: false,
        })
      )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}) => ({em: orm.em, req, res})
    })

    apolloServer.applyMiddleware({app, cors: false})

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