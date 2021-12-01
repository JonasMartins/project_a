import {
    Collection,
    Entity,
    ManyToMany,
    Property,
    ManyToOne,
    ArrayType,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./../utils/entities/base.entity";
import { User } from "./user.entity";
import NewsValidator from "./../validators/news.validator";

@ObjectType()
@Entity()
export class News extends Base<News> {
    @Field()
    @Property({ fieldName: "description" })
    description!: string;

    @Field()
    @Property({ type: "text" })
    public pathInfo!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    public creator!: User;

    @Field()
    @Property({ type: "text" })
    creator_id: string;

    @Field(() => [User])
    @ManyToMany(() => User, (user: User) => user.news, { owner: true })
    public relatedUsers: Collection<User> = new Collection<User>(this);

    @Field(() => [String])
    @Property({ type: ArrayType, nullable: true })
    usersSeen?: string[];

    constructor(body: NewsValidator) {
        super(body);
    }
}
