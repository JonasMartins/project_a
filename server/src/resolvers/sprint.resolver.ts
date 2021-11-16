import {
    Arg,
    Mutation,
    Resolver,
    ObjectType,
    Field,
    Ctx,
    Query,
} from "type-graphql";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import {
    genericError,
    getPastOrFutureDate,
} from "./../utils/generalAuxiliaryMethods";
import { Sprint } from "../entities/sprint.entity";
import { Project } from "../entities/project.entity";
import SprintValidator from "./../validators/sprint.validator";
import { Context } from "../types";
import { SprintLength } from "../enums/sprintLength.enum";
import { EntityManager } from "@mikro-orm/postgresql";

@ObjectType()
class SprintResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Sprint, { nullable: true })
    sprint?: Sprint;
}

@Resolver()
export class SprintResolver {
    @Mutation(() => SprintResponse)
    async createSprint(
        @Arg("options") options: SprintValidator,
        @Ctx() { em }: Context
    ): Promise<SprintResponse> {
        if (options.description.length <= 10) {
            return {
                errors: genericError(
                    "description",
                    "createSprint",
                    __filename,
                    "A description must have length greater than 10 charachters."
                ),
            };
        }

        const qb = (em as EntityManager).createQueryBuilder(Sprint);

        qb.select("*")
            .where({ active: true })
            .andWhere({ project_id: options.project_id })
            .limit(1);

        const activeSprints: Sprint = await qb.execute();

        if (activeSprints.length) {
            return {
                errors: genericError(
                    "project_id",
                    "createSprint",
                    __filename,
                    `Already exists a active sprint for the project with id: ${options.project_id}`
                ),
            };
        }

        const project = await em.findOne(Project, { id: options.project_id });

        if (!project) {
            return {
                errors: genericError(
                    "project_id",
                    "createSprint",
                    __filename,
                    `A projetc with id ${options.project_id} could not been found.`
                ),
            };
        }

        const sprint = await em.create(Sprint, options);

        sprint.project = project;

        let finalDate = sprint.createdAt;

        switch (options.length) {
            case SprintLength.ONE:
                finalDate = getPastOrFutureDate(sprint.createdAt, 7, "future");
                break;
            case SprintLength.TWO:
                finalDate = getPastOrFutureDate(sprint.createdAt, 14, "future");
                break;
            case SprintLength.THREE:
                finalDate = getPastOrFutureDate(sprint.createdAt, 21, "future");
                break;
            case SprintLength.FOUR:
                finalDate = getPastOrFutureDate(sprint.createdAt, 28, "future");
        }

        sprint.final = finalDate;

        sprint.active = new Date() <= finalDate;

        await em.persistAndFlush(sprint);

        return { sprint };
    }

    /**
     *      Retorna sprints com um certo limte
     */
    @Query(() => [Sprint], { nullable: true })
    async getSprints(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("active", () => Boolean, { nullable: true }) active: boolean,
        @Ctx() { em }: Context
    ): Promise<Sprint[]> {
        const max = Math.min(5, limit);

        const sprints = await em.find(
            Sprint,
            { active: active },
            { limit: max }
        );

        await em.populate(sprints, ["project"]);

        return sprints;
    }

    @Query(() => SprintResponse)
    async getSprintById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<SprintResponse> {
        const sprint = await em.findOne(
            Sprint,
            { id },
            {
                populate: ["itens"],
            }
        );

        if (!sprint) {
            return {
                errors: genericError(
                    "id",
                    "getSprintById",
                    __filename,
                    `Could not found the sprint with id ${id}`
                ),
            };
        }

        return { sprint };
    }
}
