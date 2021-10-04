import {
    Arg,
    Mutation,
    Resolver,
    ObjectType,
    Field,
    Ctx,
    Query,
} from "type-graphql";
import { Context } from "../types";
import RoleValidator from "./../validators/role.validator";
import { Role } from "./../entities/role.entity";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { genericError } from "./../utils/generalAuxiliaryMethods";

@ObjectType()
class RoleRespnse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Role, { nullable: true })
    role?: Role;
}

@ObjectType()
class RolesRespnse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Role], { nullable: true })
    roles?: Role[];
}

@Resolver()
export class RoleResolver {
    @Mutation(() => RoleRespnse)
    async createRole(
        @Arg("options") options: RoleValidator,
        @Ctx() { em }: Context
    ): Promise<RoleRespnse> {
        if (options.name.length <= 3) {
            return {
                errors: genericError(
                    "name",
                    "createRole",
                    __filename,
                    "A name must have length greater than 3 charachters."
                ),
            };
        }

        const role = await em.create(Role, options);
        await em.persistAndFlush(role);

        return { role };
    }

    @Query(() => RoleRespnse)
    async getRoleById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<RoleRespnse> {
        if (!id) {
            return {
                errors: genericError(
                    "id",
                    "getRoleById",
                    __filename,
                    "A id should've been provided."
                ),
            };
        }
        const role = await em.findOne(Role, id);

        if (!role) {
            return {
                errors: genericError(
                    "-",
                    "getRoleById",
                    __filename,
                    `The Role could not been found for this id: ${id}.`
                ),
            };
        }

        return { role };
    }

    @Query(() => RolesRespnse)
    async getAllRoles(@Ctx() { em }: Context): Promise<RolesRespnse> {
        const roles = await em.find(Role, {});

        if (!roles) {
            return {
                errors: genericError(
                    "-",
                    "getAllRoles",
                    __filename,
                    "Something went wrong"
                ),
            };
        }
        return { roles: roles };
    }
}
