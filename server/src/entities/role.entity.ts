import { Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import RoleValidator from "../validators/role.validator";
import { Base } from "./../utils/entities/base.entity";

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

    constructor(body: RoleValidator) {
        super(body);
    }
}
