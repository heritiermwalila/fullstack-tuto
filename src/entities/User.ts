import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export default class User
{
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property()
    name: string;

    @Field()
    @Property()
    email: string

    @Field()
    @Property({unique: true})
    username: string

    @Property()
    password: string

    @Property({type: 'date', onUpdate:()=>new Date()})
    created_at: Date = new Date()

    @Property({type: 'date'})
    updated_at: Date = new Date()
}