import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ResponseType } from "../../common/interfaces/response";

const prisma = new PrismaClient();
export const endpoint = "/history-players";

export function historyPlayerRoutes(router: FastifyInstance) {
  // Obtener todos los registros de history_player por clubId
  router.get(`${endpoint}/:clubId`, async (request, reply) => {
    try {
      const { clubId } = request.params as { clubId: string };
      const data = await prisma.historyPlayer.findMany({
        where: {
          clubId: clubId,
        },
        include: {
          player: true,
          typeOfPass: true,
        },
      });

      const response: ResponseType = {
        message: "Historial de jugadores obtenido exitosamente",
        data: data,
        status: 200,
      };
      reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply.status(500).send({ message: "Server error: " + error.message });
    }
  });


  router.get(`${endpoint}/playerId/:playerId`, async (request, reply) => {
    try {
      const { playerId } = request.params as { playerId: string };
      const data = await prisma.historyPlayer.findMany({
        where: {
          playerId: playerId,
        },
        include: {
          player: true,
          typeOfPass: true,
        },
      });

      const response: ResponseType = {
        message: "Historial de jugadores obtenido exitosamente",
        data: data,
        status: 200,
      };
      reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply.status(500).send({ message: "Server error: " + error.message });
    }
  });

  // Actualizar un registro de history_player
  router.put(`${endpoint}/:id`, async (request, reply) => {
    const schema = z.object({
      clubId: z.string().optional(),
      playerId: z.string().optional(),
      active: z.boolean().optional(),
      allgoals: z.number().optional(),
      allfaults: z.number().optional(),
      allcardsYellow: z.number().optional(),
      allcardsRed: z.number().optional(),
      typeOfPassId: z.string().optional(),
      payInscription: z.boolean().optional(),
    });

    try {
      const { id } = request.params as { id: string };
      const parsedBody = schema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.status(400).send({ message: "Datos no válidos", errors: parsedBody.error.errors });
      }

      const updatedHistoryPlayer = await prisma.historyPlayer.update({
        where: { id },
        data: parsedBody.data,
      });

      const response: ResponseType = {
        message: "Historial de jugador actualizado exitosamente",
        data: updatedHistoryPlayer,
        status: 200,
      };
      reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply.status(500).send({ message: "Server error: " + error.message });
    }
  });
}
