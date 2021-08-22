import { registerEnumType } from "type-graphql";

export enum ItemPriority {
    HIGHEST = "HIGHEST",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    LOWEST = "LOWEST",
}
// necessário para funcionar o uso de enums como types
registerEnumType(ItemPriority, {
    name: "ItemPriority", // this one is mandatory
    description: "The basic directions", // this one is optional
});
