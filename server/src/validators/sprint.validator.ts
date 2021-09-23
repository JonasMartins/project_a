import { SprintLength } from "./../enums/sprintLength.enum";
import { Field, InputType } from "type-graphql";
import { IsString, IsEnum } from "class-validator";

@InputType()
class SprintValidator {
    @Field()
    @IsString()
    public code: string;

    @Field()
    @IsString()
    public description: string;

    @Field(() => SprintLength)
    @IsEnum(SprintLength)
    public length: SprintLength;

    @Field()
    @IsString()
    public project_id: string;
}

export default SprintValidator;
