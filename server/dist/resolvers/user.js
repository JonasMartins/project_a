"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("./../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = require("jsonwebtoken");
const cons_1 = require("./../utils/cons");
let UserBasicData = class UserBasicData {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserBasicData.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserBasicData.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserBasicData.prototype, "email", void 0);
UserBasicData = __decorate([
    type_graphql_1.InputType()
], UserBasicData);
let ErrorFieldHandler = class ErrorFieldHandler {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ErrorFieldHandler.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ErrorFieldHandler.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ErrorFieldHandler.prototype, "method", void 0);
ErrorFieldHandler = __decorate([
    type_graphql_1.ObjectType()
], ErrorFieldHandler);
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(() => [ErrorFieldHandler], { nullable: true }),
    __metadata("design:type", Array)
], LoginResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [ErrorFieldHandler], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    hello() {
        return "Hello";
    }
    createUser(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.name.length <= 2) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "A username must have length greater than 2 charachters.",
                            method: `Method: createUser, at ${__filename}`,
                        },
                    ],
                };
            }
            if (options.password.length <= 3) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "A user password must have length greater than 3 charachters.",
                            method: `Method: createUser, at ${__filename}`,
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            options.password = hashedPassword;
            const user = em.create(User_1.User, options);
            yield em.persistAndFlush(user);
            return { user };
        });
    }
    login(email, password, { em, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { email: email });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "Email not found",
                            method: `Method: login, at ${__filename}`,
                        },
                    ],
                };
            }
            const validPass = yield argon2_1.default.verify(user.password, password);
            if (!validPass) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Incorrect password",
                            method: `Method: login, at ${__filename}`,
                        },
                    ],
                };
            }
            res.cookie(cons_1.COOKIE_NAME, jsonwebtoken_1.sign({ userId: user.id }, "paSecretCookie", {
                expiresIn: "1d",
            }), {
                httpOnly: true,
            });
            return {
                accessToken: jsonwebtoken_1.sign({ userId: user.id }, "paSecret", {
                    expiresIn: "10m",
                }),
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserBasicData, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.Mutation(() => LoginResponse),
    __param(0, type_graphql_1.Arg("email", () => String)),
    __param(1, type_graphql_1.Arg("password", () => String)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map