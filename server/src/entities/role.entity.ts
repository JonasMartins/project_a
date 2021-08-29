import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import RoleValidator from "../validators/role.validator";
import { Base } from "./../utils/entities/base.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Role extends Base<Role> {
    @Field()
    @Property({ length: 50, fieldName: "name" })
    name!: string;

    @Field()
    @Property({ length: 3, fieldName: "code" })
    code!: string;

    @Field()
    @Property({ fieldName: "description" })
    description: string;

    @Field()
    @Property({ fieldName: "wage", columnType: "money" }) // money postgrs only
    wage!: number;

    @Field(() => [User])
    @OneToMany(() => User, (user: User) => user.role, { lazy: true })
    public professionals: Collection<User> = new Collection<User>(this);

    constructor(body: RoleValidator) {
        super(body);
    }
}
