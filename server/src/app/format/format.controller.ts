import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { createFormatSchema, formatIdSchema } from "./format.validations";
import { ResponseType } from "../../common/interfaces/response";

const prisma = new PrismaClient();
export const endPointFormats = "/formats";

export function formatRoutes(router: FastifyInstance) {
  // Obtener todos los formatos
  router.get(endPointFormats, async (request, reply) => {
    try {
      const formats = await prisma.format.findMany();

      const response: ResponseType = {
        message: "Formatos obtenidos exitosamente",
        data: formats,
        status: 200,
      };

      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error)
        return reply
          .status(500)
          .send({ message: `Server error: ${error.message}` });
    }
  });

  // Crear un nuevo formato
  router.post(endPointFormats, async (request, reply) => {
    try {
      const data = createFormatSchema.parse(request.body);

      const newFormat = await prisma.format.create({
        data: {
          name: data.name,
        },
      });

      const response: ResponseType = {
        message: "Formato creado exitosamente",
        data: newFormat,
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
          .send({ message: `Server error: ${error.message}` });
    }
  });

  // Obtener un formato por ID
  router.get(`${endPointFormats}/:id`, async (request, reply) => {
    try {
      const { id } = formatIdSchema.parse(request.params);

      const format = await prisma.format.findUnique({
        where: { id },
      });

      if (!format) {
        return reply
          .status(404)
          .send({ message: "Formato no encontrado", status: 404 });
      }

      const response: ResponseType = {
        message: "Formato obtenido exitosamente",
        data: format,
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
          .send({ message: `Server error: ${error.message}` });
    }
  });
}