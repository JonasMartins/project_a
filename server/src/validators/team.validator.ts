import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
class TeamValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public description: string;

    @Field()
    @IsString()
    public leader_id: string;
}
export default TeamValidator;
