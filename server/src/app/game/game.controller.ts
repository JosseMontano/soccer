import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { gameSchema } from "./game.validations"; // Import the validation schema
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointGames = "/games";

export type GameDTO = {
  firstTeam: string;
  secondTeam: string;
  firstDate: string;
  secondDate?: string;
  cardsYellow?: number;
  cardsRed?: number;
  faults?: number;
  amountGoalsFirstTeam?: number;
  amountGoalsSecondTeam?: number;
  winner?: string;
  tournamentId: string;
};

export function gameRoutes(router: FastifyInstance) {
  // Obtener todos los juegos
  router.get(endPointGames, async (request, reply) => {
    try {
      const games = await prisma.game.findMany();
      const response: ResponseType = {
        message: "Juegos obtenidos exitosamente",
        data: games,
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

  // Crear un nuevo juego
  router.post(endPointGames, async (request, reply) => {
    try {
      const data = request.body as GameDTO;
      gameSchema.parse(data); // Validación usando Zod

      const newGame = await prisma.game.create({
        data: {
          firstTeam: data.firstTeam,
          secondTeam: data.secondTeam,
          firstDate: new Date(data.firstDate),
          secondDate: data.secondDate ? new Date(data.secondDate) : null,
          cardsYellow: data.cardsYellow,
          cardsRed: data.cardsRed,
          faults: data.faults,
          amountGoalsFirstTeam: data.amountGoalsFirstTeam,
          amountGoalsSecondTeam: data.amountGoalsSecondTeam,
          winner: data.winner,
          tournamentId: data.tournamentId,
        },
      });

      const response: ResponseType = {
        message: "Juego creado exitosamente",
        data: newGame,
        status: 201,
      };
      return reply.status(201).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          message: `"Validation.error: ${err.message}`,
        }));
        return reply.status(400).send({ errors: errorMessages });
      }
      if (error instanceof Error)
        return reply
          .status(500)
          .send({ message: "Server error " + error.message });
    }
  });

  // Actualizar un juego por ID
  router.put(endPointGames + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const data = request.body as GameDTO;
      gameSchema.parse(data); // Validación usando Zod

      const updatedGame = await prisma.game.update({
        where: { id: id },
        data: {
          firstTeam: data.firstTeam,
          secondTeam: data.secondTeam,
          firstDate: new Date(data.firstDate),
          secondDate: data.secondDate ? new Date(data.secondDate) : null,
          cardsYellow: data.cardsYellow,
          cardsRed: data.cardsRed,
          faults: data.faults,
          amountGoalsFirstTeam: data.amountGoalsFirstTeam,
          amountGoalsSecondTeam: data.amountGoalsSecondTeam,
          winner: data.winner,
          tournamentId: data.tournamentId,
        },
      });

      const response: ResponseType = {
        message: "Juego actualizado exitosamente",
        data: updatedGame,
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

  // Eliminar un juego por ID
  router.delete(endPointGames + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const deleteData = await prisma.game.delete({
        where: { id: id },
      });

      const response: ResponseType = {
        message: "Juego eliminado exitosamente",
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
