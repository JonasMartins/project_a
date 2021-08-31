import { registerEnumType } from "type-graphql";

export enum SprintLength {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
}
// necessário para funcionar o uso de enums como types
registerEnumType(SprintLength, {
    name: "SprintLength", // this one is mandatory
    description: "The basic directions", // this one is optional
});
