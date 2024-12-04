import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { playerSchema } from "./player.validations";
import { ResponseType } from "../../common/interfaces/response";
import { ZodError } from "zod";
import { RequestParams } from "../../common/interfaces/request";

const prisma = new PrismaClient();
export const endPointPlayers = "/players";

export type PlayerDTO = {
  name: string;
  lastName: string;
  nationality: string;
  birthdate: string;
  gender: string;
  photo?: string;
  clubId: string;
  commet?: string;
};

function calculateAge(birthdate: string): number {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function playerRoutes(router: FastifyInstance) {
  router.get(endPointPlayers, async (request, reply) => {
    try {
      const players = await prisma.player.findMany({
        include: {
          club: true,
        },
      });
      const fullData=players.map((v)=>{
        return{
          age: calculateAge(v.birthdate.toString()),
          ...v
        }
      })
      const response: ResponseType = {
        message: "Jugadores obtenidos exitosamente",
        data: fullData,
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

  // Create a new player
  router.post(endPointPlayers, async (request, reply) => {
    try {
      const data = request.body as PlayerDTO;
      playerSchema.parse(data);
      console.log(data);

      // Calculate the player's age
      const age = calculateAge(data.birthdate);

      // Get the club's category
      const clubCategory = await prisma.clubCategories.findFirst({
        where: { clubId: data.clubId },
        include: {
          category: {
            include: {
              typeCategory: true,
            },
          },
        },
      });

      if (!clubCategory) {
        return reply.status(400).send({
          message: "El club no tiene una categoría asociada.",
        });
      }

      const { minAge, maxAge, typeCategory } = clubCategory.category;

      // Validate player's age
      if (age < minAge || age > maxAge) {
        return reply.status(400).send({
          message: `La edad del jugador debe estar entre ${minAge} y ${maxAge} para el club.`,
        });
      }

      // Validate player's gender
      if (typeCategory.name.toLowerCase().includes("promocionales")) {
        const isMale = typeCategory.name.toLowerCase().includes("varones");
        if (
          (isMale && data.gender !== "male") ||
          (!isMale && data.gender !== "female")
        ) {
          return reply.status(400).send({
            message: `El género del jugador no coincide con la categoría del club (${typeCategory.name}).`,
          });
        }
      }

      // Create the player
      const newPlayer = await prisma.player.create({
        data: {
          name: data.name,
          lastName: data.lastName,
          nationality: data.nationality,
          birthdate: new Date(data.birthdate),
          gender: data.gender,
          photo: data.photo,
          clubId: data.clubId,
          commet: data.commet,
        },
      });

      // Automatically create HistoryPlayer record
      await prisma.historyPlayer.create({
        data: {
          playerId: newPlayer.id,
          clubId: data.clubId,
          typeOfPassId: await getDefaultPassTypeId(), // Default pass type (e.g., "Definitivo")
          active: true,
          startDate: new Date(),
          goals: 0,
          yellowCards: 0,
          redCards: 0,
          matchesPlayed: 0,
        },
      });

      const response: ResponseType = {
        message: "Jugador creado exitosamente",
        data: { ...newPlayer, age },
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

  // Update a player by ID
  router.put(endPointPlayers + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;
      const data = request.body as PlayerDTO;
      playerSchema.parse(data);

      const age = calculateAge(data.birthdate);

      const updatedPlayer = await prisma.player.update({
        where: { id: id },
        data: {
          name: data.name,
          lastName: data.lastName,
          nationality: data.nationality,
          birthdate: new Date(data.birthdate),
          photo: data.photo,
          clubId: data.clubId,
          commet: data.commet,
        },
      });

      const response: ResponseType = {
        message: "Jugador actualizado exitosamente",
        data: { ...updatedPlayer, age },
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

  // Delete a player by ID
  router.delete(endPointPlayers + "/:id", async (request, reply) => {
    try {
      const { id } = request.params as RequestParams;

      await prisma.historyPlayer.deleteMany({
        where: { playerId: id },
      });
      const deletedPlayer = await prisma.player.delete({
        where: { id: id },
      });

      const response: ResponseType = {
        message: "Jugador eliminado exitosamente",
        data: deletedPlayer,
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

// Helper to get the default pass type ID
async function getDefaultPassTypeId(): Promise<string> {
  const defaultPass = await prisma.typeOfPass.findFirst({
    where: { name: "Definitivo" },
  });
  if (!defaultPass) {
    throw new Error("Tipo de pase 'Definitivo' no encontrado.");
  }
  return defaultPass.id;
}