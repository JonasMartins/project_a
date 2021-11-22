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
import { EntityManager } from "@mikro-orm/knex";

@ObjectType()
class TeamResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Team, { nullable: true })
    team?: Team;
}

@ObjectType()
class TeamsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Team], { nullable: true })
    teams?: Team[];
}

@Resolver()
export class TeamResolver {
    @Query(() => TeamsResponse)
    async getTeams(@Ctx() { em }: Context): Promise<TeamsResponse> {
        const qb = (em as EntityManager).createQueryBuilder(Team, "t");

        try {
            qb.select(["t.*"]).orderBy({ updatedAt: "DESC" });

            const teams: Team[] = await qb.getResult();

            await em.populate(teams, ["leader"]);

            return { teams };
        } catch (e) {
            console.log("error ", e);

            return {
                errors: genericError(
                    "_",
                    "getTeams",
                    __filename,
                    `Message: ${e.messaege}`
                ),
            };
        }
    }

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

        const leader: User = await em.findOneOrFail(User, {
            id: team.leader_id,
        });

        team.leader = leader;

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
        const team = em.create(Team, {
            name: options.name,
            description: options.description,
            leader_id: options.leader_id,
        });

        await em.persistAndFlush(team);

        return { team };
    }
}
