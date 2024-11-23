import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { historyPlayerSchema } from "./historyPlayer.validations";
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";
import { PlayerRequestParams } from "../../common/interfaces/requestHistoryPlayer";

const prisma = new PrismaClient();
export const endPointHistoryPlayer = "/historyPlayer";

export function historyPlayerRoutes(router: FastifyInstance) {
  // Obtener el historial completo de un jugador
  router.get(`${endPointHistoryPlayer}/:playerId`, async (request, reply) => {
    try {
      const { playerId } = request.params as PlayerRequestParams;

      const history = await prisma.historyPlayer.findMany({
        where: { playerId },
        include: {
          club: true,
          typeOfPass: true,
        },
      });

      // Calcular estadísticas totales
      const totalStats = history.reduce(
        (totals, record) => {
          totals.totalGoals += record.goals || 0;
          totals.totalYellowCards += record.yellowCards || 0;
          totals.totalRedCards += record.redCards || 0;
          return totals;
        },
        { totalGoals: 0, totalYellowCards: 0, totalRedCards: 0 }
      );

      const response: ResponseType = {
        message: "Historial completo del jugador obtenido exitosamente",
        data: { history, totalStats },
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      return reply
        .status(500)
        .send({ message: "Error del servidor: " + (error as Error).message });
    }
  });

  // Crear un nuevo registro de historial
  router.post(endPointHistoryPlayer, async (request, reply) => {
    try {
      const data = historyPlayerSchema.parse(request.body);

      // Validar que el club y el jugador pertenezcan a la misma categoría
      const club = await prisma.club.findUnique({
        where: { id: data.clubId },
        include: { clubCategories: { include: { category: true } } },
      });

      if (!club) {
        return reply
          .status(404)
          .send({ message: "El club especificado no existe" });
      }

      const player = await prisma.player.findUnique({
        where: { id: data.playerId },
        include: { club: { include: { clubCategories: { include: { category: true } } } } },
      });

      if (!player) {
        return reply
          .status(404)
          .send({ message: "El jugador especificado no existe" });
      }

      const clubCategory = club.clubCategories[0]?.category.id;
      const playerCategory = player.club.clubCategories[0]?.category.id;

      if (clubCategory !== playerCategory) {
        return reply.status(400).send({
          message:
            "El club y el jugador deben pertenecer a la misma categoría.",
        });
      }

      // Validar fechas de inicio y fin
      if (new Date(data.endDate || "") <= new Date(data.startDate)) {
        return reply.status(400).send({
          message: "La fecha de fin debe ser posterior a la fecha de inicio.",
        });
      }

      // Verificar superposición de fechas en historial existente
      const overlappingHistory = await prisma.historyPlayer.findMany({
        where: {
          playerId: data.playerId,
          OR: [
            {
              startDate: {
                lte: new Date(data.endDate || new Date()),
              },
              endDate: {
                gte: new Date(data.startDate),
              },
            },
            {
              endDate: null,
              active: true,
            },
          ],
        },
      });

      if (overlappingHistory.length > 0) {
        return reply.status(400).send({
          message:
            "Ya existe un registro de historial activo o con fechas superpuestas.",
        });
      }

      // Desactivar historial previo si el jugador está cambiando de club
      await prisma.historyPlayer.updateMany({
        where: { playerId: data.playerId, active: true },
        data: { active: false },
      });

      // Crear nuevo registro de historial
      const newHistory = await prisma.historyPlayer.create({
        data: {
          playerId: data.playerId,
          clubId: data.clubId,
          typeOfPassId: data.typeOfPassId,
          active: data.active,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          goals: data.goals || 0,
          yellowCards: data.yellowCards || 0,
          redCards: data.redCards || 0,
          matchesPlayed: data.matchesPlayed || 0,
        },
      });

      const response: ResponseType = {
        message: "Historial creado exitosamente",
        data: newHistory,
        status: 201,
      };
      return reply.status(201).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          message: `Error de validación: ${err.message}`,
        }));
        return reply.status(400).send({ errors: errorMessages });
      }
      return reply
        .status(500)
        .send({ message: "Error del servidor: " + (error as Error).message });
    }
  });
}