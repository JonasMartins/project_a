"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
const microConfig = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [User_1.User],
    dbName: "pa_dev",
    user: "postgres",
    password: "postgres",
    port: 5432,
    debug: !constants_1.__prod__,
    type: "postgresql",
};
exports.default = microConfig;
//# sourceMappingURL=mikro-orm.config.js.map