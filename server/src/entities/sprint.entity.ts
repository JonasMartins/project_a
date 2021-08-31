import { Entity, Collection, Enum, Property, OneToMany } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./../utils/entities/base.entity";
import { SprintLength } from "./../enums/sprintLength.enum";
import { Item } from "./item.entity";

@ObjectType()
@Entity()
export class Sprint extends Base<Sprint> {
    @Field()
    @Property({ length: 5, fieldName: "code" })
    code!: string;

    @Field()
    @Property({ type: "text" })
    description!: string;

    @Field(() => SprintLength)
    @Enum(() => SprintLength)
    public length: SprintLength;

    @Field()
    @Property()
    public final: Date;

    @Field(() => [Item])
    @OneToMany(() => Item, (item: Item) => item.sprint, { lazy: true })
    public itens: Collection<Item> = new Collection<Item>(this);
}
