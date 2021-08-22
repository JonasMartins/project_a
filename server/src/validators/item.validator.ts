import { Field, InputType } from "type-graphql";
import { IsString, IsEnum } from "class-validator";
import { ItemStatus } from "./../enums/itemStatus.enum";
import { ItemType } from "./../enums/itemType.enum";
import { ItemPriority } from "./../enums/itemPriority.enum";

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

    @Field(() => ItemType)
    @IsEnum(ItemType)
    public type: ItemType;

    @Field(() => ItemPriority)
    @IsEnum(ItemPriority)
    public priority: ItemPriority;
}

export default ItemValidator;
