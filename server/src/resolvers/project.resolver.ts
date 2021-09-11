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
  @Query(() => String)
  helloProjectResolver() {
    return "Hello";
  }

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
}
