import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { ResponseType } from "../../common/interfaces/response";

const prisma = new PrismaClient();
export const endPointTypeOfPass = "/typeofpass";

export function typeOfPassRoutes(router: FastifyInstance) {
  router.get(endPointTypeOfPass, async (request, reply) => {
    try {
      const typeOfPass = await prisma.typeOfPass.findMany();
      const response: ResponseType = {
        message: "Tipos de pase obtenidos exitosamente",
        data: typeOfPass,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      return reply
        .status(500)
        .send({ message: "Error del servidor: " + (error as Error).message });
    }
  });
}