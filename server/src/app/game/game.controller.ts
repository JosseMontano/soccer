import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ResponseType } from "../../common/interfaces/response";

const prisma = new PrismaClient();
export const endPointGameEvents = "/games/events";

export function gameRoutes(router: FastifyInstance) {
  // Agregar un nuevo evento de jugador
  router.post(`${endPointGameEvents}`, async (request, reply) => {
    try {
      const { gameId, playerId, eventType } = request.body as {
        gameId: string;
        playerId: string;
        eventType: "goal" | "yellow_card" | "red_card" | "foul";
      };

      // Validar existencia del partido
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          firstTeam: true,
          secondTeam: true,
        },
      });

      if (!game) {
        return reply.status(404).send({ message: "El partido no existe." });
      }

      // Validar existencia del jugador
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          historyPlayers: {
            where: { active: true },
          },
        },
      });

      if (!player) {
        return reply.status(404).send({ message: "El jugador no existe." });
      }

      const activeHistory = player.historyPlayers[0];
      if (!activeHistory) {
        return reply.status(400).send({
          message: "El jugador no tiene un club activo registrado.",
        });
      }

      // Validar que el jugador pertenece a uno de los equipos en el partido
      if (
        activeHistory.clubId !== game.firstTeamId &&
        activeHistory.clubId !== game.secondTeamId
      ) {
        return reply.status(400).send({
          message:
            "El jugador no pertenece a ninguno de los equipos en este partido.",
        });
      }

      // Crear el evento
      const newEvent = await prisma.gameEvent.create({
        data: {
          gameId,
          playerId,
          eventType,
        },
      });

      // Actualizar estadísticas del jugador en el HistoryPlayer
      const updateStats = {
        goal: { goals: { increment: 1 } },
        yellow_card: { yellowCards: { increment: 1 } },
        red_card: { redCards: { increment: 1 } },
        foul: {}, // Las faltas no afectan al HistoryPlayer directamente
      }[eventType];

      if (Object.keys(updateStats).length > 0) {
        await prisma.historyPlayer.update({
          where: { id: activeHistory.id },
          data: updateStats,
        });
      }

      const response: ResponseType = {
        message:
          "Evento de jugador registrado y estadísticas actualizadas exitosamente",
        data: newEvent,
        status: 201,
      };
      return reply.status(201).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Error de validación",
          errors: error.errors,
        });
      }
      return reply.status(500).send({ message: `Server error: ${error} ` });
    }
  });

  router.post(`${endPointGameEvents}/prediction`, async (request, reply) => {
    try {
      // Extract data from the request body
      const { amountVictoriesTeam1, amountVictoriesTeam2 } = request.body as {
        amountVictoriesTeam1: number;
        amountVictoriesTeam2: number;
      };

      // Validate input
      if (amountVictoriesTeam1 === undefined || amountVictoriesTeam2 === undefined) {
        return reply.status(400).send({
          message: "Tanto amountVictoriesTeam1 y amountVictoriesTeam2 son requeridos",
        });
      }


      // Send data to the prediction API
      const response = await fetch("http://0.0.0.0:9000/api/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amountVictoriesTeam1,
          amountVictoriesTeam2,
        }),
      });

      // Parse response from the external API
      const result = await response.json();

      // Handle errors from the external API
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
        return reply.status(response.status).send({ message: errorBody });
      }
    

      // Send the result back to the client
      return reply.status(200).send({
        message: "Prediccion Generada exitosamente",
        data: result.data,
        status: result.status,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({
          message: "An unexpected error occurred.",
          error: error.message,
        });
      }
    }
  });

  // Obtener eventos de un partido
  router.get(`${endPointGameEvents}/:gameId`, async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };

      const events = await prisma.gameEvent.findMany({
        where: { gameId },
        include: {
          player: true, // Incluye información del jugador
        },
      });

      if (!events.length) {
        return reply.status(404).send({
          message: "No se encontraron eventos para este partido.",
        });
      }

      const response: ResponseType = {
        message: "Eventos del partido obtenidos exitosamente",
        data: events,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      return reply.status(500).send({ message: `Server error: ${error}` });
    }
  });

  // Obtener todos los partidos de un torneo
  router.get("/games/tournament/:tournamentId", async (request, reply) => {
    try {
      const { tournamentId } = request.params as { tournamentId: string };

      const games = await prisma.game.findMany({
        where: { tournamentId },
        orderBy: { date: "asc" },
        include: {
          firstTeam: true,
          secondTeam: true,
        },
      });

      if (games.length === 0) {
        return reply.status(404).send({
          message: "No hay partidos para este torneo.",
        });
      }

      const response: ResponseType = {
        message: "Partidos del torneo obtenidos exitosamente",
        data: games,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      return reply.status(500).send({ message: `Server error: ${error}` });
    }
  });

  // Obtener un partido específico
  router.get("/games/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const game = await prisma.game.findUnique({
        where: { id },
        include: {
          firstTeam: true,
          secondTeam: true,
          tournament: true,
        },
      });

      if (!game) {
        return reply.status(404).send({
          message: "El partido no existe.",
        });
      }

      const response: ResponseType = {
        message: "Partido obtenido exitosamente",
        data: game,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      return reply.status(500).send({ message: `Server error: ${error}` });
    }
  });
}
