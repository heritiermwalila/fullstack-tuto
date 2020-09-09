import { Query, Ctx, Arg, Mutation, InputType, Field, ObjectType, Resolver } from "type-graphql";
import User from "../entities/User";
import { MyContext } from "../types";
import argon2 from 'argon2'

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
    @Query(()=>[User])
    users(
        @Ctx() {em}: MyContext
    ): Promise<User[]>
    {
        return em.find(User, {})
    }

    @Mutation(()=>User)
    async register(
        @Arg('user') user: UserProps,
        @Ctx() {em}: MyContext
    ): Promise<User>
    {

        const hashedPassword = await argon2.hash(user.password)
        const newUser = em.create(User, {...user, password: hashedPassword})

        await em.persistAndFlush(newUser)

        return newUser
    }

    @Query(()=>UserResponse)
    async login(
        @Arg('input') input: UserProps,
        @Ctx() {em} : MyContext
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

        return {
            user
        }
    }
}