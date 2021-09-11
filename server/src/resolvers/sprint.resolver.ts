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

@ObjectType()
class SprintResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Sprint, { nullable: true })
    sprint?: Sprint;
}

@Resolver()
export class SprintResolver {
    @Query(() => String)
    hello() {
        return "Hello";
    }

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

        const sprint = await em.create(Sprint, options);
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

        await em.persistAndFlush(sprint);

        return { sprint };
    }
}
