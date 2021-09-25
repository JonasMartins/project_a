import {
    Collection,
    Entity,
    OneToMany,
    Property,
    ManyToMany,
    ManyToOne,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user.entity";
import { Item } from "./item.entity";
import { Base } from "../utils/entities/base.entity";
import AppointmentValidator from "../validators/appointment.validator";

@ObjectType()
@Entity()
export class Appointment extends Base<Appointment> {
    @Field()
    @Property()
    public start: Date = new Date();

    @Field()
    @Property()
    public end: Date = new Date();

    @Field(() => User)
    @ManyToOne(() => User, { lazy: true })
    public user: User;

    @Field(() => Item)
    @ManyToOne(() => Item, { lazy: true })
    public item: Item;

    constructor(body: AppointmentValidator) {
        super(body);
    }
}
