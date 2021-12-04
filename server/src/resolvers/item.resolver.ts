import {
    Arg,
    Mutation,
    Resolver,
    ObjectType,
    Field,
    Ctx,
    Query,
    UseMiddleware,
} from "type-graphql";
import { Item } from "../entities/item.entity";
import { Sprint } from "../entities/sprint.entity";
import { Context } from "../types";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import ItemValidator from "./../validators/item.validator";
import { User } from "./../entities/user.entity";
import { genericError } from "./../utils/generalAuxiliaryMethods";
import { EntityManager } from "@mikro-orm/postgresql"; // or any other driver package
import { isAuth } from "../utils/isAuth";
import { ItemStatus } from "../enums/itemStatus.enum";

@ObjectType()
class ItemResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Item, { nullable: true })
    item?: Item;
}

@ObjectType()
class ItensResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Item], { nullable: true })
    itens?: Item[];
    @Field()
    total?: Number;
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
                errors: genericError(
                    "summary",
                    "createItem",
                    __filename,
                    "A summary must have length greater than 1 charachters."
                ),
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

        const sprint = await em.findOne(Sprint, { id: options.sprint_id });

        if (!sprint) {
            return {
                errors: [
                    {
                        field: "sprint_id",
                        message: `Could not found a valid sprpint with id ${options.sprint_id}`,
                        method: `Method: createItem, at ${__filename}`,
                    },
                ],
            };
        }

        item.sprint = sprint;

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

    @Query(() => ItensResponse)
    async getItensRelatedToUserByPeriod(
        @Arg("userId") userId: string,
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("createdAfter", () => Date, { nullable: true }) createdAfter: Date,
        @Arg("createdLater", () => Date, { nullable: true }) createdLater: Date,
        @Ctx() { em }: Context
    ): Promise<ItensResponse> {
        const max = Math.min(10, limit);

        if (!userId) {
            return {
                errors: genericError(
                    "userId",
                    "getItensRelatedToUserByPeriod",
                    __filename,
                    "A user Id must be passed as argument"
                ),
            };
        }

        const qb = (em as EntityManager).createQueryBuilder(Item);

        qb.select("*")
            .where({ reporter_id: userId })
            .orWhere({ responsible_id: userId })
            .orWhere({ reporter_id: userId })
            .andWhere({
                created_at: { $gte: createdAfter, $lte: createdLater },
            })
            .limit(max);

        // console.log(qb.getQuery());

        const itens = await qb.getResult();

        await em.populate(itens, ["sprint"]);

        return { itens };
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

    /**
     *
     *      Essa mutation deve receber um numero de pagina, e
     *  uma quantidade de itens por pagina, os itens serão ordenados por
     *  data de update inicialmente.
     *
     *  Deve receber outro argumento chamado cursor, que deve ser a data de atualização
     *  do ultimo item da página anterior, se não for passado, siguinifica que o usuário navega
     *  pela primeira página.
     *
     *  Recebendo o cursor com a data, ele retorna os itens com a data mais antiga que aquele item
     *
     * @param limit
     * @param cursor
     * @returns
     */
    @Query(() => ItensResponse)
    @UseMiddleware(isAuth)
    async getItensBacklog(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("offset", () => Number, { nullable: true }) offset: number,
        @Ctx() { em }: Context
    ): Promise<ItensResponse> {
        const max = Math.min(10, limit);
        const maxOffset = Math.min(10, offset);

        const qb = (em as EntityManager).createQueryBuilder(Item, "i");

        /*
        // $gte, $lte = >=| <=, $gt, $lt :  > | <
        // With join
        if (cursor) {
            qb.select(["i.*", "u.name"], true)
                .leftJoin("i.responsible", "u")
                .where({ updatedAt: { $lt: cursor } })
                .limit(max)
                .orderBy({ updatedAt: "DESC" });
        } else {
            qb.select(["i.*", "u.name"], true)
                .leftJoin("i.responsible", "u")
                .where({ "1": "1" })
                .limit(max)
                .orderBy({ updatedAt: "DESC" });
        } */

        /*
        if (cursor) {
            qb.select(["i.*"])
                .where({ updatedAt: { $lt: cursor } })
                .limit(max)
                .orderBy({ updatedAt: "DESC" })
                .groupBy("i.id");
        } else {
            qb.select(["i.*"])
                .where({ "1": "1" })
                .limit(max)
                .orderBy({ updatedAt: "DESC" });
        } */

        qb.select(["i.*"])
            .where("1 = 1")
            .orderBy({ updatedAt: "DESC" })
            .limit(max)
            .offset(maxOffset);

        try {
            const itens = await qb.getResult();

            await em.populate(itens, ["responsible"]);
            await em.populate(itens, ["reporter"]);
            await em.populate(itens, ["sprint.project"]);

            const total = await em.count(Item);

            return { itens, total };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getItensBacklog",
                    __filename,
                    `message: ${e.message}`
                ),
            };
        }
    }

    @Mutation(() => Boolean)
    async changeItemStatus(
        @Arg("id") id: string,
        @Arg("newStatus", () => ItemStatus) newStatus: ItemStatus,
        @Ctx() { em }: Context
    ): Promise<Boolean> {
        const item = await em.findOne(Item, { id });

        if (!item) {
            return new Promise((resolve, _) => {
                resolve(false);
            });
        }

        item.status = newStatus;

        await em.persistAndFlush(item);

        return new Promise((resolve, _) => {
            resolve(true);
        });
    }
}
