import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { ResponseType } from "../../common/interfaces/response";

const prisma = new PrismaClient();
export const endpoint = "/categories";


export function categoryRoutes(router: FastifyInstance) {
  router.get(endpoint, async (request, reply) => {
    try {

      const categories = await prisma.categories.findMany();

      const response: ResponseType = {
        message: "Categorias obtenidas",
        data: categories,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ message: "Server error: " + error.message });
      }
    }
  });
}