import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export default class Post
{
    @Field(()=>Int)
    @PrimaryKey()
    id!: number;

    @Field()
    @Property()
    title:string;

    @Field()
    @Property({type:'date'})
    created_at:Date =  new Date();

    @Field()
    @Property({type: 'date', onUpdate: () => new Date()})
    updated_at: Date = new Date()
}