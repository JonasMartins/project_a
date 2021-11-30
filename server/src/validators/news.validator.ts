import { Field, InputType } from "type-graphql";
import { IsString } from "class-validator";

@InputType()
class NewsValidator {
    @Field()
    @IsString()
    public description: string;
}

export default NewsValidator;
