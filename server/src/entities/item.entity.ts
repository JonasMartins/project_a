import {
    Entity,
    Enum,
    ManyToOne,
    OneToMany,
    Property,
    Collection,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user.entity";
import { Sprint } from "./sprint.entity";
import { ItemStatus } from "../enums/itemStatus.enum";
import { ItemPriority } from "../enums/itemPriority.enum";
import { ItemType } from "../enums/itemType.enum";
import { Base } from "./../utils/entities/base.entity";
import { Appointment } from "./appointment.entity";
import { Comment } from "./comments.entity";
import ItemValidator from "./../validators/item.validator";

@ObjectType()
@Entity()
export class Item extends Base<Item> {
    @Field()
    @Property({ type: "text" })
    summary!: string;

    @Field()
    @Property({ type: "text" })
    description!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    public reporter: User;

    @Field(() => User)
    @ManyToOne(() => User)
    public responsible: User;

    @Field(() => User)
    @ManyToOne(() => User)
    public approver: User;

    @Field(() => ItemStatus)
    @Enum(() => ItemStatus)
    public status: ItemStatus;

    @Field(() => ItemType)
    @Enum(() => ItemType)
    public type: ItemType;

    @Field(() => ItemPriority)
    @Enum(() => ItemPriority)
    public priority: ItemPriority;

    @Field()
    @Property({ type: "text" })
    responsible_id: string;

    @Field()
    @Property({ type: "text" })
    reporter_id: string;

    @Field()
    @Property({ type: "text" })
    approver_id: string;

    @Field(() => Sprint)
    @ManyToOne(() => Sprint)
    public sprint: Sprint;

    @Field(() => [Appointment])
    @OneToMany(
        () => Appointment,
        (appointment: Appointment) => appointment.item,
        { lazy: true }
    )
    public appointments: Collection<Appointment> = new Collection<Appointment>(
        this
    );

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, (comments: Comment) => comments.item, {
        lazy: true,
        nullable: true,
    })
    public comments: Collection<Comment> = new Collection<Comment>(this);

    constructor(body: ItemValidator) {
        super(body);
    }
}
