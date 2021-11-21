import {
    Collection,
    Entity,
    OneToMany,
    Property,
    ManyToOne,
} from "@mikro-orm/core";
import { Base } from "./../utils/entities/base.entity";
import { Item } from "./item.entity";
import { User } from "./user.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Comment extends Base<Comment> {
    @Field()
    @Property({ type: "text" })
    body!: string;

    @Field(() => Item)
    @ManyToOne(() => Item, { lazy: true })
    public item!: Item;

    @Field(() => User)
    @ManyToOne(() => User)
    public author!: User;

    @Field()
    @Property({ type: "number", default: 1 })
    public order: number;

    @Field(() => [Comment])
    @OneToMany(() => Comment, (replies: Comment) => replies.parent, {
        eager: true,
        nullable: true,
        orphanRemoval: true,
    })
    public replies: Collection<Comment> = new Collection<Comment>(this);

    @Field(() => Comment, { nullable: true })
    @ManyToOne(() => Comment, { lazy: true, nullable: true })
    public parent: Comment;
}
