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
import { Sprint } from "./../entities/sprint.entity";
import ProjectValidator from "./../validators/project.validator";
import { Context } from "../types";
import { genericError } from "./../utils/generalAuxiliaryMethods";
import { EntityManager } from "@mikro-orm/postgresql";
import { Collection } from "@mikro-orm/core";
import { Item } from "../entities/item.entity";

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
    @Mutation(() => ProjectResponse)
    async updateProject(
        @Arg("id", () => String) id: string,
        @Arg("name", () => String) name: string,
        @Arg("description", () => String) description: string,
        @Ctx() { em, req }: Context
    ): Promise<ProjectResponse> {
        console.log("req ", req);
        if (description.length <= 2) {
            return {
                errors: [
                    {
                        field: "description",
                        message:
                            "A project description must have length greater than 2.",
                        method: `Method: updateProject, at ${__filename}`,
                    },
                ],
            };
        }

        const project = await em.findOne(Project, { id });

        if (!project) {
            return {
                errors: [
                    {
                        field: "id",
                        message: `Could not found the project with id: ${id}`,
                        method: `Method: updateProject, at ${__filename}`,
                    },
                ],
            };
        }

        project.name = name;
        project.description = description;

        try {
            await em.persistAndFlush(project);
        } catch (e) {
            return {
                errors: [
                    {
                        field: "-",
                        message: `${e.message}`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

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

        const qb = (em as EntityManager).createQueryBuilder(Project);

        qb.select("*").where({ id: id }).limit(1);

        const result = await qb.getResult();

        let project: Project | null = null;
        if (result.length) {
            project = result[0];
        }

        const qqb = (em as EntityManager).createQueryBuilder(Sprint);

        qqb.select("*")
            .where({ project_id: id })
            .andWhere({ active: true })
            .limit(1);

        const sprint = await qqb.getResult();

        await em.populate(sprint, ["itens"]);

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

        if (sprint) {
            await project.sprints.init();
            await project.sprints.add(sprint[0]);

            const itensQuery = (em as EntityManager).createQueryBuilder(Item);

            itensQuery.select("*").where({ sprint_id: sprint[0].id });

            const itens = await itensQuery.getResult();

            await em.populate(itens, ["responsible"]);
            await em.populate(itens, ["reporter"]);
            await em.populate(itens, ["approver"]);

            await sprint[0].itens.init();
            await sprint[0].itens.set(itens);
        }

        return { project };
    }
}
