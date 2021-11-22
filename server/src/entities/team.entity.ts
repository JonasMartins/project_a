import {
    Entity,
    Property,
    ManyToMany,
    Collection,
    ManyToOne,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./../utils/entities/base.entity";
import { User } from "./user.entity";
import TeamValidator from "./../validators/team.validator";

@ObjectType()
@Entity()
export class Team extends Base<Team> {
    @Field()
    @Property({ length: 50, fieldName: "name" })
    name!: string;

    @Field()
    @Property({ fieldName: "description" })
    description: string;

    @Field(() => User)
    @ManyToOne(() => User)
    public leader!: User;

    @Field()
    @Property({ type: "text" })
    leader_id: string;

    @Field(() => [User])
    @ManyToMany(() => User, (user: User) => user.teams, { owner: true })
    public members: Collection<User> = new Collection<User>(this);

    constructor(body: TeamValidator) {
        super(body);
    }
}
