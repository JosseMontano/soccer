import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { playerSchema } from "./player.validations"; // Import the validation schema
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointPlayers = "/players";


export type PlayerDTO = {
    name: string;
    Ci: number;
    lastName: string;
    nationality: string;
    age: number;
    commet: number;
    birthdate: string;
    photo: string;
}

export function playerRoutes(router: FastifyInstance) {
 
    router.get(endPointPlayers, async (request, reply) => {
        try {
            const players = await prisma.player.findMany();
            const response: ResponseType = {
                message: "Jugadores obtenidos existosamente",
                data: players,
                status: 200
            }
            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error " + error.message });
        }
    });


    router.post(endPointPlayers, async (request, reply) => {
        try {
            const data = request.body as PlayerDTO;
            playerSchema.parse(data); // Validate using Zod

            const newPlayer = await prisma.player.create({
                data: {
                    name: data.name,
                    Ci: data.Ci,
                    lastName: data.lastName,
                    age: data.age,
                    birthdate: data.birthdate,
                    commet: data.commet,
                    nationality: data.nationality,
                    photo: data.photo
                }
            });

            const response: ResponseType = {
                message: `Jugador creado exitosamente`,
                data: newPlayer,
                status: 201
            }
            return reply.status(201).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map(err => ({ message: `Validation error: ${err.message}` }));
                return reply.status(400).send({ errors: errorMessages });
            }
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error " + error.message });
        }
    });

  
    router.put(endPointPlayers + "/:id", async (request, reply) => {
        try {
            const { id } = request.params as RequestParams;

            const data = request.body as PlayerDTO;
            playerSchema.parse(data);

            const updatedPlayer = await prisma.player.update({
                where: { id: id },
                data: {
                    name: data.name
                    , Ci: data.Ci
                    , lastName: data.lastName
                    , age: data.age
                    , birthdate: data.birthdate
                    , commet: data.commet
                    , nationality: data.nationality
                    , photo: data.photo,
                },
            });

            const response: ResponseType = {
                message: `Jugador actualizado exitosamente`,
                data: updatedPlayer,
                status: 200
            }
            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map(err => ({ message: `Validation error: ${err.message}` }));
                return reply.status(400).send({ errors: errorMessages });
            }
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error " + error.message });
        }
    });


    router.delete(endPointPlayers + "/:id", async (request, reply) => {
        try {
            const { id } = request.params as RequestParams;
            const deleteData = await prisma.player.delete({
                where: { id: id },
            });

            const response: ResponseType = {
                message: "Se elimino el jugador exitosamente",
                data: deleteData,
                status: 200
            }
            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error " + error.message });
        }
    });
}



