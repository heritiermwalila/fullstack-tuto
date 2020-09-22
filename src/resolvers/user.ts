import { Query, Ctx, Arg, Mutation, InputType, Field, ObjectType, Resolver } from "type-graphql";
import User from "../entities/User";
import { MyContext } from "../types";
import argon2 from 'argon2'
// import {EntityManager} from '@mikro-orm/mysql'

@InputType()
class UserProps {
    @Field(()=>String, {nullable: true})
    name?: string;

    @Field(()=>String, {nullable: true})
    email?: string;

    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError
{
    @Field()
    field:string;
    @Field()
    message:string;
}


@ObjectType()
class UserResponse
{
    @Field(()=>[FieldError], {nullable: true})
    errors?: [FieldError]

    @Field(()=>User, {nullable: true})
    user?:User
}



@Resolver()
export class UserResolver
{
    @Query(()=>[User], {nullable:true})
    async users(
        @Ctx() {em}: MyContext
    ): Promise<User[]>
    {
        
        return await em.find(User, {})
    }

    @Query(()=>User, {nullable: true})
    async user(@Ctx() {em, req}: MyContext)
    {
        if(!req.session.userId){
            return null
        }
        const user = await em.findOne(User, {id: req.session.userId})
        return user
    }

    @Mutation(()=>UserResponse, {nullable:true})
    async register(
        @Arg('input') input: UserProps,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse | null>
    {
        
        if(input.username.length <= 2){
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username must be more than 2 characters long'
                    }
                ]
            }
        }

        if(input.password.length <= 2){
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password must be more than 2 characters long'
                    }
                ]
            }
        }

        const hashedPassword = await argon2.hash(input.password)

        let user = await em.findOne(User, {username: input.username})

        

        if(!user){
           
            user = em.create(User, {...input, password: hashedPassword})
            await em.persistAndFlush(user)
            
            req.session.userId = user.id
            
            return {user}
            
            
        }else{
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'This username is already taken'
                    }
                ]
            }
        }
        
    }

    @Mutation(()=>UserResponse)
    async login(
        @Arg('input') input: UserProps,
        @Ctx() {em, req} : MyContext
    ): Promise<UserResponse>
    {
        const user = await em.findOne(User, {username: input.username})
       
        if(!user){
            return {
               errors: [
                   {
                       field: 'username',
                       message: 'This username does not exist'
                   }
               ]
            }
        }

        const passwordMatch = await argon2.verify(user.password, input.password)

        if(!passwordMatch){
            return {
               errors: [
                   {
                       field: 'password',
                       message: 'Incorrect password provided'
                   }
               ]
            }
        }

        req.session.userId = user.id
        
        return {
            user
        }
    }

    @Query(()=>User)
    async me(
        @Ctx(){em, req}: MyContext
    )
    {
        const user = await em.findOne(User, {id: req.session.userId})
        return user
    }
}