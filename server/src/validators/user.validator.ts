import { Field, InputType } from "type-graphql";
import { IsString } from "class-validator";
@InputType()
class UserValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public email: string;

    @Field()
    @IsString()
    public password: string;
}

export default UserValidator;
