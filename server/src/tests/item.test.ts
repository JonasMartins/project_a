import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import Application from "../application";
import createSimpleUuid from "./../utils/helpers/createSimpleUuid.helper";
import { expect } from "chai";
import { SuperTest, Test } from "supertest";
import supertest = require("supertest");

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager<IDatabaseDriver<Connection>>;

describe("Item tests", async () => {
    before(async () => {
        application = new Application();
        await application.connect();
        await application.init();

        em = application.orm.em.fork();

        request = supertest(application.app);
        console.log(request);
    });

    after(async () => {
        application.server.close();
    });

    it("should get item by id", async () => {
        let id: string = createSimpleUuid(1);
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
                    getItemById(id: "${id}"){
                        errors {
                            method
                            message
                        }
                        item {
                            id
                            summary
                            description
                            responsible {
                                id
                                name
                                email
                            }
                            approver {
                                id
                                name
                                email
                            }
                        }    
                    }
                }
            `,
            })
            .expect(200);

        expect(response.body.data.getItemById).to.be.a("object");
    });
});
