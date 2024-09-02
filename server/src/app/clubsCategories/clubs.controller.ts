import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ResponseType } from "../../common/interfaces/response";

const prisma = new PrismaClient();
export const endpoint = "/club-categories";

export function clubCategoriesRoutes(router: FastifyInstance) {
  // Obtener todas las categorías de un club
  router.get(endpoint + "/:clubId", async (request, reply) => {
    try {
      const { clubId } = request.params as { clubId: string };
      const data = await prisma.clubCategories.findMany({
        where: {
          clubId: clubId,
        },
        include: {
          category: {include:{typeCategories:true}},
          
        },
      });

      const response: ResponseType = {
        message: "Categorías del club obtenidas exitosamente",
        data: data,
        status: 200,
      };
      reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply.status(500).send({ message: "Server error: " + error.message });
    }
  });

  // Actualizar categorías de un club
  router.put(endpoint + "/:clubId", async (request, reply) => {
    const schema = z.object({
      categories: z.string().array(),
    });

    try {
      const { clubId } = request.params as { clubId: string };
      const parsedBody = schema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.status(400).send({ message: "Categorías no válidas", errors: parsedBody.error.errors });
      }

      // Verificar si todas las categorías existen
      const categories = await prisma.categories.findMany({
        where: {
          id: {
            in: parsedBody.data.categories,
          },
        },
      });

      if (parsedBody.data.categories.length !== categories.length) {
        return reply.status(400).send({ message: "Alguna(s) categoría(s) no encontrada(s)", data: [], status: 400 });
      }

      // Eliminar las categorías anteriores del club
      await prisma.clubCategories.deleteMany({
        where: {
          clubId: clubId,
        },
      });

      // Agregar las nuevas categorías
      const data = await prisma.clubCategories.createMany({
        data: parsedBody.data.categories.map((categoryId) => {
          return {
            categoryId: categoryId,
            clubId: clubId,
          };
        }),
      });

      const response: ResponseType = {
        message: "Categorías del club actualizadas exitosamente",
        data: data,
        status: 200,
      };
      reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply.status(500).send({ message: "Server error: " + error.message });
    }
  });
}
