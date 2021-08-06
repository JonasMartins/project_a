import {
    Arg,
    Mutation,
    Resolver,
    ObjectType,
    Field,
    Ctx,
    Query,
} from "type-graphql";
import { Item } from "../entities/item.entity";
import { Context } from "../types";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import ItemValidator from "./../validators/item.validator";
import { User } from "./../entities/user.entity";

@ObjectType()
class ItemResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Item, { nullable: true })
    item?: Item;
}

@Resolver()
export class ItemResolver {
    @Mutation(() => ItemResponse)
    async createItem(
        @Arg("options") options: ItemValidator,
        @Arg("reporterId") reporterId: string,
        @Arg("responsibleId") responsibleId: string,
        @Arg("approverId") apporverId: string,
        @Ctx() { em }: Context
    ): Promise<ItemResponse> {
        if (options.summary.length <= 1) {
            return {
                errors: [
                    {
                        field: "summary",
                        message:
                            "A summary must have length greater than 1 charachters.",
                        method: `Method: createItem, at ${__filename}`,
                    },
                ],
            };
        }

        if (options.description.length <= 10) {
            return {
                errors: [
                    {
                        field: "description",
                        message:
                            "A description must have length greater than 10 charachters.",
                        method: `Method: createItem, at ${__filename}`,
                    },
                ],
            };
        }

        const item = await em.create(Item, options);
        item.createdAt = new Date();
        const reporter: User = await em.findOneOrFail(User, { id: reporterId });

        if (!reporter) {
            return {
                errors: [
                    {
                        field: "reporter",
                        message: "The item's reporter could not be found ",
                        method: `Method: createItem, at ${__filename}`,
                    },
                ],
            };
        }

        // Lógica para evitar ir ao banco caso, haja
        // repetição entre aprovador, responsável ou
        // criador do item
        let isApproverSameResponsible: Boolean = false;
        let isReporterSameApprover: Boolean = false;

        item.reporter = reporter;

        if (reporterId === responsibleId) {
            item.responsible = reporter;
            isReporterSameApprover = reporterId === apporverId;
        } else {
            const responsible: User = await em.findOneOrFail(User, {
                id: responsibleId,
            });

            if (!responsible) {
                return {
                    errors: [
                        {
                            field: "responsible",
                            message:
                                "The item's responsible could not be found ",
                            method: `Method: createItem, at ${__filename}`,
                        },
                    ],
                };
            }

            item.responsible = responsible;
            if (apporverId === responsibleId) {
                item.approver = responsible;
                isApproverSameResponsible = true;
            }
        }

        if (isReporterSameApprover) {
            item.approver = reporter;
        } else {
            if (isApproverSameResponsible) {
                item.approver = item.responsible;
            } else {
                const approver: User = await em.findOneOrFail(User, {
                    id: apporverId,
                });

                if (!approver) {
                    return {
                        errors: [
                            {
                                field: "approver",
                                message:
                                    "The item's approver could not be found ",
                                method: `Method: createItem, at ${__filename}`,
                            },
                        ],
                    };
                }

                item.approver = approver;
            }
        }

        await em.persistAndFlush(item);

        return { item };
    }

    @Query(() => ItemResponse)
    async getItemById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<ItemResponse> {
        if (!id) {
            return {
                errors: [
                    {
                        field: "id",
                        message: "An Id must be provided",
                        method: `Method: getItemById, at ${__filename}`,
                    },
                ],
            };
        }

        const item: Item = await em.findOneOrFail(Item, {
            id,
        });

        return { item };
    }
}
