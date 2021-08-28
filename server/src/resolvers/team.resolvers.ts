import {
    Arg,
    Mutation,
    Resolver,
    ObjectType,
    Field,
    Ctx,
    Query,
} from "type-graphql";
import { Team } from "./../entities/team.entity";
import TeamValidator from "./../validators/team.validator";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { Context } from "../types";
import { genericError } from "./../utils/generalAuxiliaryMethods";
import { User } from "../entities/user.entity";

@ObjectType()
class TeamResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Team, { nullable: true })
    team?: Team;
}

@Resolver()
export class TeamResolver {
    @Query(() => TeamResponse)
    async getTeamById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<TeamResponse> {
        if (!id) {
            return {
                errors: [
                    {
                        field: "id",
                        message: "An Id must be provided",
                        method: `Method: getTeamById, at ${__filename}`,
                    },
                ],
            };
        }
        const team: Team = await em.findOneOrFail(Team, {
            id,
        });

        return { team };
    }

    @Mutation(() => TeamResponse)
    async createTeam(
        @Arg("options") options: TeamValidator,
        @Ctx() { em }: Context
    ): Promise<TeamResponse> {
        if (options.description.length <= 3) {
            return {
                errors: genericError(
                    "description",
                    "createTeam",
                    __filename,
                    "A team description must have length greater than 3 charachters."
                ),
            };
        }

        const user: User | null = await em.findOne(User, {
            id: options.leader_id,
        });

        if (!user) {
            return {
                errors: genericError(
                    "leader_id",
                    "createTeam",
                    __filename,
                    "The team leader could not been found."
                ),
            };
        }

        // let team: Team | null = null;
        const team: Team = await em.create(Team, {
            leader: user,
            name: options.name,
            leader_id: options.leader_id,
            description: options.description,
        });

        await em.persistAndFlush(team);

        return { team };
    }
}
