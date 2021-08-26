import { IsDecimal, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
class RoleValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public code: string;

    @Field()
    @IsString()
    public description: string;

    @Field()
    @IsDecimal()
    public wage: number;
}
export default RoleValidator;
