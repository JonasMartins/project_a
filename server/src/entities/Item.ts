import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

export enum ItemStatus {
    OPEN = 1,
    IN_PROGRESS = 2,
    REOPENED = 3,
    RESOLVED = 4,
    CLOSED = 5,
    COMPLETED = 6,
}

@ObjectType()
@Entity()
export class Item {
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
    @Property({ type: "text" })
    summary!: string;

    @Field()
    @Property({ type: "text" })
    description!: string;

    @Field(() => Int)
    reporterId: number;

    @ManyToOne({ entity: () => User })
    reporter!: User;

    @Field(() => Int)
    responsibleId: number;

    @ManyToOne({ entity: () => User })
    responsible!: User;

    @Field(() => Int)
    approverId: number;

    @ManyToOne({ entity: () => User })
    approver!: User;

    @Enum({ default: ItemStatus.OPEN })
    status!: ItemStatus;
}
