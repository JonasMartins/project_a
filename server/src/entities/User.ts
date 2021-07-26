import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => Date)
    @Property({ type: "date" })
    createdAt: Date = new Date();

    @Field(() => Date)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Field()
    @Property({ type: "text", unique: true })
    name!: string;

    @Field()
    @Property({ type: "text", unique: true, nullable: true })
    email: string;

    @Property({ type: "text" })
    password!: string;

    @Property({ default: 0 })
    tokenVersion: number;
}
