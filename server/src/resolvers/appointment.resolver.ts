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
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import AppointmentValidator from "./../validators/appointment.validator";
import { Appointment } from "../entities/appointment.entity";
import { genericError } from "./../utils/generalAuxiliaryMethods";
import { EntityManager } from "@mikro-orm/postgresql";
import { Item } from "../entities/item.entity";
import { User } from "../entities/user.entity";

@ObjectType()
class AppointmentResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Appointment, { nullable: true })
    appointment?: Appointment;
}

@ObjectType()
class AppointmentsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Appointment], { nullable: true })
    appointments?: [Appointment] | (Appointment & {})[];
}

@Resolver()
export class AppointmentResolver {
    @Query(() => AppointmentsResponse)
    async getAppointmentsByItem(
        @Arg("itemId") itemId: string,
        @Ctx() { em }: Context,
        @Arg("limit", () => Number, { nullable: true }) limit: number
    ): Promise<AppointmentsResponse> {
        const max = Math.min(10, limit);
        if (!itemId) {
            return {
                errors: genericError(
                    "itemId",
                    "getAppointmentsByItem",
                    __filename,
                    "A user Id must be passed as argument"
                ),
            };
        }

        const item = await em.find(Item, { id: itemId });
        if (!item) {
            return {
                errors: genericError(
                    "itemId",
                    "getAppointmentsByItem",
                    __filename,
                    `Could not found the item with id: ${itemId}`
                ),
            };
        }

        /*
        const qb = (em as EntityManager).createQueryBuilder(Appointment);

        qb.select("*").where({ item_id: itemId }).limit(max);

        const appointments: [Appointment] = await qb.execute();

        return { appointments }; */
        const appointments = await em.find(
            Appointment,
            { item: item },
            {
                populate: ["user"],
            }
        );

        return { appointments };
    }

    @Query(() => AppointmentsResponse)
    async getAppointmentsByUser(
        @Arg("userId") userId: string,
        @Ctx() { em }: Context,
        @Arg("limit", () => Number, { nullable: true }) limit: number
    ): Promise<AppointmentsResponse> {
        const max = Math.min(10, limit);
        if (!userId) {
            return {
                errors: genericError(
                    "userId",
                    "getAppointmentsByItem",
                    __filename,
                    "A user Id must be passed as argument"
                ),
            };
        }

        const qb = (em as EntityManager).createQueryBuilder(Appointment);

        qb.select("*").where({ user_id: userId }).limit(max);

        const appointments: [Appointment] = await qb.execute();

        return { appointments };
    }

    // super simple, only bring data from appointments
    // to get data from user and id, must insert those info
    // on appointment variable with specifc data
    @Mutation(() => AppointmentResponse)
    async createAppointment(
        @Arg("options") options: AppointmentValidator,
        @Ctx() { em }: Context
    ): Promise<AppointmentResponse> {
        const user = await em.findOne(User, { id: options.user_id });

        if (!user) {
            return {
                errors: genericError(
                    "UserId",
                    "createAppointment",
                    __filename,
                    `Could not found the user with this id: ${options.user_id}`
                ),
            };
        }

        const item = await em.findOne(Item, { id: options.item_id });

        if (!item) {
            return {
                errors: genericError(
                    "ItemId",
                    "createAppointment",
                    __filename,
                    `Could not found the item with this id: ${options.item_id}`
                ),
            };
        }

        const qb = (em as EntityManager).createQueryBuilder(Appointment);

        qb.select("COUNT(*)")
            .where({ end: null })
            .orWhere({ end: { $gte: options.start } })
            .andWhere({ user_id: options.user_id });

        // qb.getFormattedQuery() => como será a query

        const previousAppointments = await qb.execute();

        if (
            previousAppointments[0].count &&
            Number(previousAppointments[0].count)
        ) {
            return {
                errors: genericError(
                    "-",
                    "createAppointment",
                    __filename,
                    `Could not save appointment, there is another appointment for this user active, or with intersection periods.`
                ),
            };
        }

        const appointment = await em.create(Appointment, options);

        appointment.user = user;
        appointment.item = item;

        await em.persistAndFlush(appointment);

        return { appointment };
    }
}
