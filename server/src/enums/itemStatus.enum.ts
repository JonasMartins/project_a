import { registerEnumType } from "type-graphql";

export enum ItemStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    REOPENED = "REOPENED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    COMPLETED = "COMPLETED",
}
// necessário para funcionar o uso de enums como types
registerEnumType(ItemStatus, {
    name: "ItemStatus", // this one is mandatory
    description: "The basic directions", // this one is optional
});
