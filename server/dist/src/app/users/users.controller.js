"use strict";
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
exports.usersRoutes = usersRoutes;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const users_validations_1 = require("./users.validations");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const endPoint = "/users";
const JWT_SECRET = "your-secret-key";
function usersRoutes(router) {
    router.post(endPoint + "/create-admin", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = request.headers["authorization"];
            const decoded = jsonwebtoken_1.default.verify(token !== null && token !== void 0 ? token : "", JWT_SECRET);
            if (decoded.roleId != "1") {
                return reply
                    .status(500)
                    .send({ message: "no tienes permisos para crear" });
            }
            const data = request.body;
            users_validations_1.userSchema.parse(data);
            const hashedPassword = yield bcrypt_1.default.hash("123456", 10);
            const newCategory = yield prisma.users.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    roleId: "2"
                },
            });
            const response = {
                message: "Admin registrado exitosamente",
                data: newCategory,
                status: 201,
            };
            return reply.status(201).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    message: `Validation error: ${err.message}`,
                }));
                return reply.status(400).send({ errors: errorMessages });
            }
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error " + error.message });
        }
    }));
    router.post(endPoint + "/login", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = users_validations_1.loginSchema.parse(request.body);
            // Check if the user exists in the database
            const user = yield prisma.users.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                return reply.status(404).send({ message: "Usuario no encontrado" });
            }
            // Verify the password
            const isPasswordValid = yield bcrypt_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                return reply.status(401).send({ message: "Credenciales incorrectas" });
            }
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                roleId: user.roleId,
            }, JWT_SECRET, { expiresIn: "1h" } // Token expiration time
            );
            // Send the response
            const response = {
                message: "Inicio de sesión exitoso",
                data: {
                    user: { id: user.id, email: user.email, roleId: user.roleId, token },
                },
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    message: `Validation error: ${err.message}`,
                }));
                return reply.status(400).send({ errors: errorMessages });
            }
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error: " + error.message });
        }
    }));
    router.post(endPoint + "/register", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            users_validations_1.userSchema.parse(data);
            const hashedPassword = yield bcrypt_1.default.hash("123456", 10);
            const newCategory = yield prisma.users.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    roleId: "4"
                },
            });
            const response = {
                message: "Registrado correctament",
                data: newCategory,
                status: 201,
            };
            return reply.status(201).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    message: `Validation error: ${err.message}`,
                }));
                return reply.status(400).send({ errors: errorMessages });
            }
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error " + error.message });
        }
    }));
}
