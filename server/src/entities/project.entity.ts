import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./../utils/entities/base.entity";
import { Sprint } from "./sprint.entity";

@ObjectType()
@Entity()
export class Project extends Base<Project> {
    @Field()
    @Property({ type: "text" })
    name!: string;

    @Field()
    @Property({ type: "text" })
    description!: string;

    @Field(() => [Sprint])
    @OneToMany(() => Sprint, (sprint: Sprint) => sprint.project, {
        lazy: true,
    })
    public sprints: Collection<Sprint> = new Collection<Sprint>(this);
}
