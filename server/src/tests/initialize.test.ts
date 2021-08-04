//var assert = require("assert");
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import Application from "./../aplication";
import { SuperTest, Test } from "supertest";
import supertest = require("supertest");
/*
 before(function() {
    // runs once before the first test in this block
  });

  after(function() {
    // runs once after the last test in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });
 */

let _request: SuperTest<Test>;
let _application: Application;
let _em: EntityManager<IDatabaseDriver<Connection>>;

describe("Sample tests", async () => {
    after(async () => {
        _application.server.close();
    });

    it("should initialize the application and connect to the database", async () => {
        //assert.equal([1, 2, 3].indexOf(3), -1);
        _application = new Application();
        await _application.connect();
        await _application.init();

        _em = _application.orm.em.fork();

        _request = supertest(_application.app);
    });
});
