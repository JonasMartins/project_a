import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base } from "../utils/entities/base.entity";
import AppointmentValidator from "../validators/appointment.validator";
import { Item } from "./item.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Appointment extends Base<Appointment> {
    @Field()
    @Property()
    public start: Date;

    @Field(() => Date, { nullable: true })
    @Property({ nullable: true })
    public end: Date;

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
