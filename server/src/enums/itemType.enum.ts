import { registerEnumType } from "type-graphql";

export enum ItemType {
    BUG = "BUG",
    TASK = "TASK",
    STORY = "STORY",
}
// necessário para funcionar o uso de enums como types
registerEnumType(ItemType, {
    name: "ItemType", // this one is mandatory
    description: "The basic directions", // this one is optional
});
