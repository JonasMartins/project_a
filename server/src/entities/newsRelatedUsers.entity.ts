import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class NewsRelatedUsers {
    @Field()
    @PrimaryKey()
    @Property({ type: "text" })
    user_id: string;

    @Field()
    @PrimaryKey()
    @Property({ type: "text" })
    news_id: string;
}
