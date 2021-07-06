import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { Context } from "./../types";

@InputType()
class UserBasicData {
    @Field()
    name: string;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello";
    }

    @Mutation(() => String)
    createUser(
        @Arg("options") options: UserBasicData,
        @Ctx() { req }: Context
    ): String {
        console.log("req ", req.baseUrl);

        return "Hello " + options.name;
    }
}
