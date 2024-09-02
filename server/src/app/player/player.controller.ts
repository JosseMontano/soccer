import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { clubSchema } from "./clubs.validations"; // Import the validation schema
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointClubs = "/clubs";

export type ClubDTO = {
    name: string;
}

export function clubRoutes(router: FastifyInstance) {
    // Get all clubs
    router.get(endPointClubs, async (request, reply) => {
        try {
            const clubs = await prisma.club.findMany();
            const response: ResponseType = {
                message: "Clubs obtenidos existosamente",
                data: clubs,
                status: 200
            }
            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error " + error.message });
        }
    });

    // Create a new club
    router.post(endPointClubs, async (request, reply) => {
        try {
            const data = request.body as ClubDTO;
            clubSchema.parse(data); // Validate using Zod

            const newClub = await prisma.club.create({
                data: {
                    name: data.name,
                },
            });

            const response: ResponseType = {
                message: `Club creado exitosamente`,
                data: newClub,
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

    // Update a club by ID
    router.put(endPointClubs + "/:id", async (request, reply) => {
        try {
            const { id } = request.params as RequestParams;
       
            const data = request.body as ClubDTO;
            clubSchema.parse(data);

            const updatedClub = await prisma.club.update({
                where: { id: id },
                data: { name: data.name },
            });

            const response: ResponseType = {
                message: `Club actualizado exitosamente`,
                data: updatedClub,
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

    // Delete a club by ID
    router.delete(endPointClubs + "/:id", async (request, reply) => {
        try {
            const { id } = request.params as RequestParams;
            const deletedClub = await prisma.club.delete({
                where: { id: id },
            });

            const response: ResponseType = {
                message: "Se elimino el club exitosamente",
                data: deletedClub,
                status: 200
            }
            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error " + error.message });
        }
    });
}



