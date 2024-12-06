import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { clubSchema } from "./clubs.validations";
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointClubs = "/clubs";

export type ClubDTO = {
  name: string;
  logo?: string;
  categoryId: string;
};

export function clubRoutes(router: FastifyInstance) {
  // Get all clubs
  router.get(endPointClubs, async (request, reply) => {
    try {
      const clubs = await prisma.club.findMany({
        include: {
          clubCategories: {
            include: {
              category: true,
            },
          },
        },
      });
      const response = {
        message: "Clubs obtenidos exitosamente",
        data: clubs,
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
  router.get(
    endPointClubs + "/category/:categoryId",
    async (request, reply) => {
      try {
        const { categoryId } = request.params as { categoryId: string };

        const clubs = await prisma.club.findMany({
          where: {
            clubCategories: {
              some: {
                categoryId: categoryId, 
              },
            },
          },
          include: {
            clubCategories: {
              include: {
                category: true,
              },
            },
          },
        });

        const response: ResponseType = {
          message:
            "Clubs obtenidos exitosamente para la categoría especificada",
          data: clubs,
          status: 200,
        };

        return reply.status(200).send(response);
      } catch (error) {
        if (error instanceof Error)
          return reply
            .status(500)
            .send({ message: "Server error " + error.message });
      }
    }
  );
  router;
  router.get(endPointClubs + "/select", async (request, reply) => {
    try {
      const clubs = await prisma.club.findMany({
        include: {
          clubCategories: {
            include: {
              category: true,
            },
          },
        },
      });

      // Transformar los datos al formato deseado
      const transformedData = clubs.flatMap((club) =>
        club.clubCategories.map((clubCategory) => {
          const { name: categoryName, minAge, maxAge } = clubCategory.category;
          return {
            clubId: club.id,
            value: `${club.name} | ${categoryName} | ${minAge} a ${maxAge} años`,
          };
        })
      );

      const response = {
        message: "Clubs obtenidos exitosamente",
        data: transformedData,
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

  // Create a new club
  router.post(endPointClubs, async (request, reply) => {
    try {
      const data = request.body as ClubDTO;
      clubSchema.parse(data);

      const newClub = await prisma.club.create({
        data: {
          name: data.name,
          logo: data.logo,
        },
      });
      const clubCategory = await prisma.clubCategories.create({
        data: {
          clubId: newClub.id,
          categoryId: data.categoryId,
        },
      });

      const response: ResponseType = {
        message: "Club creado exitosamente",
        data: {
          club: newClub,
          clubCategory,
        },
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

  router.put(endPointClubs + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const data = request.body as ClubDTO;
      clubSchema.parse(data);

      const updatedClub = await prisma.club.update({
        where: { id: id },
        data: {
          name: data.name,
          logo: data.logo,
        },
      });

      const response: ResponseType = {
        message: "Club actualizado exitosamente",
        data: updatedClub,
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

  // Delete a club by ID
  router.delete(endPointClubs + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const deletedClub = await prisma.club.delete({
        where: { id: id },
      });

      const response: ResponseType = {
        message: "Club eliminado exitosamente",
        data: deletedClub,
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
