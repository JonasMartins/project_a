import {
    Mutation,
    Query,
    Resolver,
    ObjectType,
    Field,
    Arg,
    Ctx,
} from "type-graphql";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { Project } from "./../entities/project.entity";
import ProjectValidator from "./../validators/project.validator";
import { Context } from "../types";
import { genericError } from "./../utils/generalAuxiliaryMethods";

@ObjectType()
class ProjectResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Project, { nullable: true })
    project?: Project;
}

@Resolver()
export class ProjectResolver {
    @Mutation(() => ProjectResponse)
    async createProject(
        @Arg("options") options: ProjectValidator,
        @Ctx() { em }: Context
    ): Promise<ProjectResponse> {
        if (options.description.length <= 3) {
            return {
                errors: genericError(
                    "description",
                    "createProject",
                    __filename,
                    "A description must have length greater than 3 charachters."
                ),
            };
        }

        const project = await em.create(Project, options);

        await em.persistAndFlush(project);

        return { project };
    }
    @Query(() => [Project], { nullable: true })
    async getProjects(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Ctx() { em }: Context
    ): Promise<Project[]> {
        const max = Math.min(5, limit);

        const projects = await em.find(Project, {}, { limit: max });

        return projects;
    }

    @Query(() => ProjectResponse)
    async getProjectById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<ProjectResponse> {
        if (!id) {
            return {
                errors: genericError(
                    "id",
                    "getProjectById",
                    __filename,
                    "The project Id is required"
                ),
            };
        }

        const project = await em.findOne(Project, id);

        if (!project) {
            return {
                errors: genericError(
                    "id",
                    "getProjectById",
                    __filename,
                    `Could not found the project with id = ${id}`
                ),
            };
        }

        project.sprints.loadItems(); // magic, load the sprints on the object

        return { project };
    }
}
