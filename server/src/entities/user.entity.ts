import {
    Collection,
    Entity,
    OneToMany,
    Property,
    ManyToMany,
    ManyToOne,
} from "@mikro-orm/core";
import UserValidator from "./../validators/user.validator";
import { Field, ObjectType } from "type-graphql";
import { Item } from "./item.entity";
import { Base } from "./../utils/entities/base.entity";
import { Team } from "./team.entity";
import { Role } from "./role.entity";
import { Appointment } from "./appointment.entity";

@ObjectType()
@Entity()
export class User extends Base<User> {
    @Field()
    @Property({ type: "text", unique: true })
    name!: string;

    @Field()
    @Property({ type: "text", unique: true, nullable: true })
    email: string;

    @Field()
    @Property({ type: "text" })
    password!: string;

    @Property({ default: 0 })
    tokenVersion: number;

    @Field(() => [Item])
    @OneToMany(() => Item, (item: Item) => item.reporter, { lazy: true })
    public itenReporter: Collection<Item> = new Collection<Item>(this);

    // very important, eager true is the only way to get the itens, in which this
    // user si responsible of, in this example
    @Field(() => [Item])
    @OneToMany(() => Item, (item: Item) => item.responsible, { lazy: true })
    public itenResponsible: Collection<Item> = new Collection<Item>(this);

    @Field(() => [Item])
    @OneToMany(() => Item, (item: Item) => item.approver, { lazy: true })
    public itenApprover: Collection<Item> = new Collection<Item>(this);

    @Field(() => [Team])
    @ManyToMany(() => Team, (team: Team) => team.members, {
        mappedBy: "members",
    })
    public teams: Collection<Team> = new Collection<Team>(this);

    @Field(() => Role)
    @ManyToOne(() => Role, { eager: true })
    public role: Role;

    @Field(() => [Appointment])
    @OneToMany(
        () => Appointment,
        (appointment: Appointment) => appointment.user,
        { lazy: true }
    )
    public appointments: Collection<Appointment> = new Collection<Appointment>(
        this
    );

    @Field(() => String, { nullable: true })
    @Property({ nullable: true, length: 255 })
    public picure: string;

    @Field(() => Boolean)
    @Property({ default: true })
    public active: boolean;

    constructor(body: UserValidator) {
        super(body);
    }
}
