import { Field, InputType } from "type-graphql";
import { IsString } from "class-validator";

@InputType()
class NewsValidator {
    @Field()
    @IsString()
    public description: string;

    @Field()
    @IsString()
    public pathInfo: string;
}

export default NewsValidator;
