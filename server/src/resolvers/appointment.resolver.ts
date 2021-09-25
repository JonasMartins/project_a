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
    appointments?: [Appointment];
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

        const qb = (em as EntityManager).createQueryBuilder(Appointment);

        qb.select("*").where({ item_id: itemId }).limit(max);

        const appointments: [Appointment] = await qb.execute();

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
        @Arg("userId") userId: string,
        @Arg("itemId") itemId: string,
        @Arg("start") start: Date,
        @Ctx() { em }: Context
    ): Promise<AppointmentResponse> {
        const qb = (em as EntityManager).createQueryBuilder(Appointment);

        const appointmentValidator: AppointmentValidator =
            new AppointmentValidator();

        appointmentValidator.item_id = itemId;
        appointmentValidator.user_id = userId;
        appointmentValidator.start = start;

        const appointment: Appointment = new Appointment(appointmentValidator);

        qb.insert(appointment);

        try {
            await qb.execute();
            return { appointment };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createAppointment",
                    __filename,
                    `message: ${e.message}`
                ),
            };
        }
    }
}
