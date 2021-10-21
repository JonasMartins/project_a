import { Field, InputType } from "type-graphql";
import { IsDate, IsString } from "class-validator";

@InputType()
class AppointmentValidator {
    @Field()
    @IsDate()
    public start: Date;

    @Field()
    @IsString()
    public item_id: string;

    @Field()
    @IsString()
    public user_id: string;
}
export default AppointmentValidator;
