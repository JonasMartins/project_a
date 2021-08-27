import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "./../entities/user.entity";

@InputType()
class TeamValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public description: string;

    @Field(() => User, { nullable: false })
    public leader: User;
}
export default TeamValidator;
