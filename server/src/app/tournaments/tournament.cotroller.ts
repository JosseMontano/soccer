import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { tournamentSchema } from "./tournament.validations"; // Importar el esquema de validación
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointTournaments = "/tournaments";

export type TournamentDTO = {
  name: string;
  dateStart: string; 
  dateEnd: string;
  formatId?: string;
};
export function tournamentRoutes(router: FastifyInstance) {
  router.get(endPointTournaments, async (request, reply) => {
    try {
      const tournaments = await prisma.tournaments.findMany();
      const response: ResponseType = {
        message: "Torneos obtenidos existosamente",
        data: tournaments,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply
          .status(500)
          .send({ message: "Server error " + error.message });
    }
  });
  router.post(endPointTournaments, async (request, reply) => {
    try {
      const data = request.body as TournamentDTO;
      tournamentSchema.parse(data); // Validación usando Zod

      const newTournament = await prisma.tournaments.create({
        data: {
          name: data.name,
          dateStart: new Date(data.dateStart),
          dateEnd: new Date(data.dateEnd),
          formatId: data.formatId,
        },
      });
      const response: ResponseType = {
        message: "Torneo creado exitosamente",
        data: newTournament,
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
  router.put(endPointTournaments + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;

      const data = request.body as TournamentDTO;
      tournamentSchema.parse(data);

      const updatedTournament = await prisma.tournaments.update({
        where: { id: id },
        data: {
          name: data.name,
          dateStart: new Date(data.dateStart),
          dateEnd: new Date(data.dateEnd),
          formatId: data.formatId,
        },
      });
      const response: ResponseType = {
        message: "Torneo actualizado exitosamente",
        data: updatedTournament,
        status: 200,
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
          .send({ message: "Server error " + error.message });
    }
  });
  router.delete(endPointTournaments + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const deleteData = await prisma.tournaments.delete({
        where: { id: id },
      });

      const response: ResponseType = {
        message: "Torneo eliminado exitosamente",
        data: deleteData,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply
          .status(500)
          .send({ message: "Server error " + error.message });
    }
  });
}