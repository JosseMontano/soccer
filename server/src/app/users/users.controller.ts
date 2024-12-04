

import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { loginSchema, userSchema } from "./users.validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const endPoint = "/users";

export type UserDTO = {
    email: string;
};

export type User = {
    email: string;
    roleId: string
}


const JWT_SECRET = "your-secret-key"

export function usersRoutes(router: FastifyInstance) {
    router.get(endPoint + "/seed", async (_, reply) => {
        try {
            const roles = [
                { id: "1", name: "superAdmin" },
                { id: "2", name: "admin" },
                { id: "3", name: "manager" },
                { id: "4", name: "user" },
            ]
            for (const v of roles) {
                await prisma.roles.create({
                    data: {
                        id: v.id,
                        name: v.name
                    }
                })
            }
            const hashedPassword = await bcrypt.hash("123456", 10)
            await prisma.users.create({
                data: {
                    email: "superadmin@gmail.com",
                    password: hashedPassword,
                    roleId: roles[0].id,
                }
            })

            return reply.status(200).send({ "message": "Semilla de Roles creada exitosamente." });
        } catch (error) {
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error " + error.message });
        }
    });


    router.post(endPoint + "/create-admin", async (request, reply) => {
        try {
            const token = request.headers["authorization"];

            const decoded = jwt.verify(token ?? "", JWT_SECRET) as User;

            if (decoded.roleId != "1") {
                return reply
                    .status(500)
                    .send({ message: "no tienes permisos para crear" });
            }

            const data = request.body as UserDTO;
            userSchema.parse(data);

            const hashedPassword = await bcrypt.hash("123456", 10)
            const newCategory = await prisma.users.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    roleId: "2"
                },
            });

            const response: ResponseType = {
                message: "Admin registrado exitosamente",
                data: newCategory,
                status: 201,
            };
            return reply.status(201).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
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
    });

    router.post(endPoint + "/login", async (request, reply) => {
        try {

            const data = loginSchema.parse(request.body);

            // Check if the user exists in the database
            const user = await prisma.users.findUnique({
                where: { email: data.email },
            });

            if (!user) {
                return reply.status(404).send({ message: "Usuario no encontrado" });
            }

            // Verify the password
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                return reply.status(401).send({ message: "Credenciales incorrectas" });
            }

            // Generate a JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                },
                JWT_SECRET,
                { expiresIn: "1h" } // Token expiration time
            );

            // Send the response
            const response = {
                message: "Inicio de sesión exitoso",

                data: {
                    user: { id: user.id, email: user.email, roleId: user.roleId, token },
                    
                },
            };

            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
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
    });

    router.post(endPoint + "/register", async (request, reply) => {
        try {


            const data = request.body as UserDTO;
            userSchema.parse(data);

            const hashedPassword = await bcrypt.hash("123456", 10)
            const newCategory = await prisma.users.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    roleId: "4"
                },
            });

            const response: ResponseType = {
                message: "Registrado correctament",
                data: newCategory,
                status: 201,
            };
            return reply.status(201).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
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
    });

}