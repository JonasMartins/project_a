import { Field, InputType } from "type-graphql";
import { IsString, IsEnum } from "class-validator";
import { ItemStatus } from "./../enums/itemStatus.enum";

@InputType()
class ItemValidator {
    @Field()
    @IsString()
    public summary: string;

    @Field()
    @IsString()
    public description: string;

    @Field(() => ItemStatus)
    @IsEnum(ItemStatus)
    public status: ItemStatus;
}

export default ItemValidator;
