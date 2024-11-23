import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { categorySchema } from "./categories.validations";
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointCategories = "/categories";

export type CategoryDTO = {
  name: string;
  typeCategoryId: string;
  minAge: number;
  maxAge: number;
};

export function categoryRoutes(router: FastifyInstance) {
  // Get all categories
  router.get(endPointCategories, async (request, reply) => {
    try {
      const categories = await prisma.categories.findMany({
        include: {
          typeCategory: true, // Include typeCategory for context
        },
      });
      const response: ResponseType = {
        message: "Categorías obtenidas exitosamente",
        data: categories,
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

  // Create a new category
  router.post(endPointCategories, async (request, reply) => {
    try {
      const data = request.body as CategoryDTO;
      categorySchema.parse(data);

      const newCategory = await prisma.categories.create({
        data: {
          name: data.name,
          typeCategoryId: data.typeCategoryId,
          minAge: data.minAge,
          maxAge: data.maxAge,
        },
      });

      const response: ResponseType = {
        message: "Categoría creada exitosamente",
        data: newCategory,
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

  // Update a category by ID
  router.put(endPointCategories + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const data = request.body as CategoryDTO;
      categorySchema.parse(data);

      const updatedCategory = await prisma.categories.update({
        where: { id: id },
        data: {
          name: data.name,
          typeCategoryId: data.typeCategoryId,
          minAge: data.minAge,
          maxAge: data.maxAge,
        },
      });

      const response: ResponseType = {
        message: "Categoría actualizada exitosamente",
        data: updatedCategory,
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

  // Delete a category by ID
  router.delete(endPointCategories + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const deletedCategory = await prisma.categories.delete({
        where: { id: id },
      });

      const response: ResponseType = {
        message: "Categoría eliminada exitosamente",
        data: deletedCategory,
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
