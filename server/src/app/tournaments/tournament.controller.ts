import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import {
  createTournamentSchema,
  updateTournamentSchema,
} from "./tournament.validations";
import { ResponseType } from "../../common/interfaces/response";
import { endpoint } from "../clubsCategories/clubs.controller";

const prisma = new PrismaClient();
export const endPointTournaments = "/tournaments";

export function tournamentRoutes(router: FastifyInstance) {
  // Obtener todos los torneos
  router.get(endPointTournaments, async (request, reply) => {
    try {
      const tournaments = await prisma.tournaments.findMany({
        include: {
          format: true,
          finalFormat: true,
          category: true,
        },
      });
      const response: ResponseType = {
        message: "Torneos obtenidos exitosamente",
        data: tournaments,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(500)
          .send({ message: "Error del servidor: " + error.message });
      }
    }
  });

  router.get(
    `${endPointTournaments}/tournamentsPublic`,
    async (request, reply) => {
      try {
        const tournaments = await prisma.tournaments.findMany({
          where: {
            games: {
              some: {}, // Ensures tournaments with at least one game are fetched
            },
          },
          include: {
            games: {
              include: {
                firstTeam: {
                  include: {
                    players: true, // Include players of the first team
                  },
                },
                secondTeam: {
                  include: {
                    players: true, // Include players of the second team
                  },
                },
              },
            },
          },
        });

        // Fetch all games to calculate total victories
        const allGames = await prisma.game.findMany();

        // Count victories for each team
        const victoryCount: Record<string, number> = {};
        allGames.forEach((game) => {
          if (game.winnerId) {
            victoryCount[game.winnerId] = (victoryCount[game.winnerId] || 0) + 1;
          }
        });

        // Fetch the last 5 games for each team, excluding the current tournament
        const teamHistories: Record<string, any[]> = {};
        for (const game of allGames) {
          const teamIds = [game.firstTeamId, game.secondTeamId];
          for (const teamId of teamIds) {
            if (!teamHistories[teamId]) {
              teamHistories[teamId] = await prisma.game.findMany({
                where: {
                  OR: [
                    { firstTeamId: teamId },
                    { secondTeamId: teamId },
                  ],
                  tournamentId: { not: game.tournamentId }, // Exclude current tournament
                },
                include: {
                  firstTeam: true,
                  secondTeam: true,
                },
                orderBy: {
                  date: 'desc', // Replace `date` with your actual game date field
                },
                take: 5, // Limit to last 5 games
              });
            }
          }
        }

        // Attach `amountVictories` and `history` to each team's data in tournaments
        const enrichedTournaments = tournaments.map((tournament) => ({
          ...tournament,
          games: tournament.games.map((game) => ({
            ...game,
            firstTeam: {
              ...game.firstTeam,
              amountVictories: victoryCount[game.firstTeam.id] || 0,
              history: teamHistories[game.firstTeam.id] || [],
            },
            secondTeam: {
              ...game.secondTeam,
              amountVictories: victoryCount[game.secondTeam.id] || 0,
              history: teamHistories[game.secondTeam.id] || [],
            },
          })),
        }));

        // Send enriched response
        const response: ResponseType = {
          message: "Torneos obtenidos exitosamente",
          data: enrichedTournaments,
          status: 200,
        };
        return reply.status(200).send(response);

      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(500)
            .send({ message: "Error del servidor: " + error.message });
        }
      }
    }
  );


  router.post(endPointTournaments, async (request, reply) => {
    try {
      const data = createTournamentSchema.parse(request.body);

      const clubs = await prisma.club.findMany({
        where: {
          id: { in: data.clubIds },
        },
        include: {
          clubCategories: true,
        },
      });

      // Verificar si todos los clubes están en la categoría del torneo
      const valid = clubs.every((club) =>
        club.clubCategories.some((category) => category.id === data.categoryId)
      );
      if (valid) {
        return reply.status(400).send({
          message: "Algunos clubes no pertenecen a la categoría del torneo",
        });
      }
      const newTournament = await prisma.tournaments.create({
        data: {
          name: data.name,
          description: data.description,
          dateStart: new Date(data.dateStart),
          dateEnd: new Date(data.dateEnd),
          formatId: data.formatId,
          finalFormatId: data.finalFormatId,
          categoryId: data.categoryId,
        },
      });

      await prisma.tournamentClub.createMany({
        data: data.clubIds.map((clubId) => {
          return {
            tournamentId: newTournament.id,
            clubId: clubId,
          };
        }),
      });

      const response: ResponseType = {
        message: "Torneo creado exitosamente",
        data: newTournament,
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
      if (error instanceof Error) {
        return reply
          .status(500)
          .send({ message: "Error del servidor: " + error.message });
      }
    }
  });

  // Actualizar un torneo
  router.put(`${endPointTournaments}/:id`, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const data = updateTournamentSchema.parse(request.body);

      if (data.formatId) {
        const formatExists = await prisma.format.findUnique({
          where: { id: data.formatId },
        });
        if (!formatExists) {
          return reply.status(400).send({
            message: "El formato especificado no existe.",
          });
        }
      }

      if (data.finalFormatId) {
        const finalFormatExists = await prisma.format.findUnique({
          where: { id: data.finalFormatId },
        });
        if (!finalFormatExists) {
          return reply.status(400).send({
            message: "El formato de la final especificado no existe.",
          });
        }
      }

      if (data.categoryId) {
        const categoryExists = await prisma.categories.findUnique({
          where: { id: data.categoryId },
        });
        if (!categoryExists) {
          return reply.status(400).send({
            message: "La categoría especificada no existe.",
          });
        }
      }

      const updatedTournament = await prisma.tournaments.update({
        where: { id },
        data: {
          ...data,
          dateStart: `${data.dateStart}T00:00:00.000Z`,
          dateEnd: `${data.dateEnd}T00:00:00.000Z`,
        },
      });

      const response: ResponseType = {
        message: "Torneo actualizado exitosamente",
        data: updatedTournament,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Error de validación",
          errors: error.errors,
        });
      }
      if (error instanceof Error) {
        return reply
          .status(500)
          .send({ message: "Error del servidor: " + error.message });
      }
    }
  });

  // Eliminar un torneo
  router.delete(`${endPointTournaments}/:id`, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const deletedTournament = await prisma.tournaments.delete({
        where: { id },
      });

      const response: ResponseType = {
        message: "Torneo eliminado exitosamente",
        data: deletedTournament,
        status: 200,
      };
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(500)
          .send({ message: "Error del servidor: " + error.message });
      }
    }
  });

  router.post(
    `${endPointTournaments}/:id/generate-fixture`,
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const tournament = await prisma.tournaments.findUnique({
          where: { id },
          include: {
            tournamentClubs: {
              include: {
                club: true,
              },
            },
          },
        });

        if (!tournament) {
          return reply.status(404).send({ message: "Torneo no encontrado." });
        }

        const teams = tournament.tournamentClubs.map(
          (clubCategory) => clubCategory.club
        );
        if (teams.length < 2) {
          return reply.status(400).send({
            message:
              "El torneo debe tener al menos 2 equipos registrados para generar el fixture.",
          });
        }

        if (teams.length % 2 !== 0) {
          return reply.status(400).send({
            message:
              "El número de equipos debe ser par para generar el fixture. Registre un equipo adicional.",
          });
        }

        // Distribuir fechas de partidos entre las fechas de inicio y fin del torneo
        const totalDays = Math.ceil(
          (new Date(tournament.dateEnd).getTime() -
            new Date(tournament.dateStart).getTime()) /
          86400000
        );
        if (totalDays < teams.length / 2) {
          return reply.status(400).send({
            message:
              "El rango de fechas del torneo no es suficiente para programar todos los partidos.",
          });
        }

        const shuffledTeams = teams.sort(() => Math.random() - 0.5); // Mezclar los equipos aleatoriamente
        const fixtures = [];
        let currentDate = new Date(tournament.dateStart);

        for (let i = 0; i < shuffledTeams.length; i += 2) {
          if (i + 1 < shuffledTeams.length) {
            // Asegurar que la fecha no exceda la fecha de finalización del torneo
            if (currentDate > new Date(tournament.dateEnd)) break;

            fixtures.push({
              firstTeamId: shuffledTeams[i].id,
              secondTeamId: shuffledTeams[i + 1].id,
              date: new Date(currentDate), // Asignar la fecha actual al partido
              tournamentId: id,
              goalsFirstTeam: 0,
              goalsSecondTeam: 0,
              yellowCardsFirstTeam: 0,
              yellowCardsSecondTeam: 0,
              redCardsFirstTeam: 0,
              redCardsSecondTeam: 0,
              foulsFirstTeam: 0,
              foulsSecondTeam: 0,
            });

            // Incrementar la fecha en 1 día
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }

        // Crear los partidos en la base de datos
        const createdGames = await prisma.game.createMany({
          data: fixtures,
        });

        // Marcar el fixture como generado
        await prisma.tournaments.update({
          where: { id },
          data: { fixtureGenerated: true },
        });

        const response: ResponseType = {
          message: "Fixture generado exitosamente.",
          data: createdGames,
          status: 201,
        };
        return reply.status(201).send(response);
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(500)
            .send({ message: "Error del servidor: " + error.message });
        }
      }
    }
  );
}
