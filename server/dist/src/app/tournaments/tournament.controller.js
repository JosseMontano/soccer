"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPointTournaments = void 0;
exports.tournamentRoutes = tournamentRoutes;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const tournament_validations_1 = require("./tournament.validations");
const prisma = new client_1.PrismaClient();
exports.endPointTournaments = "/tournaments";
function tournamentRoutes(router) {
    // Obtener todos los torneos
    router.get(exports.endPointTournaments, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const tournaments = yield prisma.tournaments.findMany({
                include: {
                    format: true,
                    finalFormat: true,
                    category: true,
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
            const response = {
                message: "Torneos obtenidos exitosamente",
                data: tournaments,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return reply
                    .status(500)
                    .send({ message: "Error del servidor: " + error.message });
            }
        }
    }));
    router.get(`${exports.endPointTournaments}/info-club`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { clubId, tournamentId } = request.query;
        // Fetch all games to calculate total victories
        const allGames = yield prisma.game.findMany({
            where: {
                OR: [
                    { firstTeamId: clubId },
                    { secondTeamId: clubId },
                ],
                tournamentId: { not: tournamentId }
            },
            include: {
                firstTeam: true,
                secondTeam: true
            }
        });
        const response = {
            message: "Informacion del club obtenida exitosamente",
            data: allGames,
            status: 200,
        };
        return reply.status(200).send(response);
    }));
    router.get(`${exports.endPointTournaments}/tournamentsPublic`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { date } = request.query;
        const selectedDate = date ? new Date(date) : new Date(); // Crear un rango para la fecha seleccionada
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0); // Inicio del día
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999); // Fin del día
        try {
            const tournaments = yield prisma.tournaments.findMany({
                where: {
                    games: {
                        some: {
                            date: {
                                gte: startOfDay, // Mayor o igual al inicio del día
                                lt: endOfDay, // Menor al fin del día
                            },
                        },
                    },
                },
                include: {
                    format: true,
                    finalFormat: true,
                    category: true,
                    games: {
                        where: {
                            date: {
                                gte: startOfDay, // Mayor o igual al inicio del día
                                lt: endOfDay, // Menor al fin del día
                            },
                        },
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
            const allGames = yield prisma.game.findMany();
            // Count victories for each team
            const victoryCount = {};
            allGames.forEach((game) => {
                if (game.winnerId) {
                    victoryCount[game.winnerId] =
                        (victoryCount[game.winnerId] || 0) + 1;
                }
            });
            //console.log(allGames);
            // Fetch the last 5 games for each team, excluding the current tournament
            const teamHistories = {};
            for (const game of allGames) {
                const teamIds = [game.firstTeamId, game.secondTeamId];
                for (const teamId of teamIds) {
                    if (!teamHistories[teamId]) {
                        teamHistories[teamId] = yield prisma.game.findMany({
                            where: {
                                OR: [{ firstTeamId: teamId }, { secondTeamId: teamId }],
                                tournamentId: { not: game.tournamentId }, // Exclude current tournament
                            },
                            include: {
                                firstTeam: true,
                                secondTeam: true,
                            },
                            orderBy: {
                                date: "desc", // Replace `date` with your actual game date field
                            },
                            take: 5, // Limit to last 5 games
                        });
                    }
                }
            }
            // Attach `amountVictories` and `history` to each team's data in tournaments
            const enrichedTournaments = tournaments.map((tournament) => (Object.assign(Object.assign({}, tournament), { games: tournament.games.map((game) => (Object.assign(Object.assign({}, game), { firstTeam: Object.assign(Object.assign({}, game.firstTeam), { amountVictories: victoryCount[game.firstTeam.id] || 0, history: teamHistories[game.firstTeam.id] || [] }), secondTeam: Object.assign(Object.assign({}, game.secondTeam), { amountVictories: victoryCount[game.secondTeam.id] || 0, history: teamHistories[game.secondTeam.id] || [] }) }))) })));
            // Send enriched response
            const response = {
                message: "Torneos obtenidos exitosamente",
                data: enrichedTournaments,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return reply
                    .status(500)
                    .send({ message: "Error del servidor: " + error.message });
            }
        }
    }));
    router.post(exports.endPointTournaments, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = tournament_validations_1.createTournamentSchema.parse(request.body);
            const clubs = yield prisma.club.findMany({
                where: {
                    id: { in: data.clubIds },
                },
                include: {
                    clubCategories: true,
                },
            });
            // Verificar si todos los clubes están en la categoría del torneo
            const valid = clubs.every((club) => club.clubCategories.some((category) => category.id === data.categoryId));
            if (valid) {
                return reply.status(400).send({
                    message: "Algunos clubes no pertenecen a la categoría del torneo",
                });
            }
            const newTournament = yield prisma.tournaments.create({
                data: {
                    name: data.name,
                    description: data.description,
                    dateStart: new Date(data.dateStart),
                    dateEnd: new Date(data.dateEnd),
                    formatId: data.formatId,
                    finalFormatId: data.finalFormatId,
                    categoryId: data.categoryId,
                },
                include: {
                    format: true,
                    finalFormat: true,
                    category: true,
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
            yield prisma.tournamentClub.createMany({
                data: data.clubIds.map((clubId) => {
                    return {
                        tournamentId: newTournament.id,
                        clubId: clubId,
                    };
                }),
            });
            const response = {
                message: "Torneo creado exitosamente",
                data: newTournament,
                status: 201,
            };
            return reply.status(201).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
    }));
    // Actualizar un torneo
    router.put(`${exports.endPointTournaments}/:id`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const data = tournament_validations_1.updateTournamentSchema.parse(request.body);
            if (data.formatId) {
                const formatExists = yield prisma.format.findUnique({
                    where: { id: data.formatId },
                });
                if (!formatExists) {
                    return reply.status(400).send({
                        message: "El formato especificado no existe.",
                    });
                }
            }
            if (data.finalFormatId) {
                const finalFormatExists = yield prisma.format.findUnique({
                    where: { id: data.finalFormatId },
                });
                if (!finalFormatExists) {
                    return reply.status(400).send({
                        message: "El formato de la final especificado no existe.",
                    });
                }
            }
            if (data.categoryId) {
                const categoryExists = yield prisma.categories.findUnique({
                    where: { id: data.categoryId },
                });
                if (!categoryExists) {
                    return reply.status(400).send({
                        message: "La categoría especificada no existe.",
                    });
                }
            }
            const updatedTournament = yield prisma.tournaments.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { dateStart: `${data.dateStart}T00:00:00.000Z`, dateEnd: `${data.dateEnd}T00:00:00.000Z` }),
                include: {
                    format: true,
                    finalFormat: true,
                    category: true,
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
            const response = {
                message: "Torneo actualizado exitosamente",
                data: updatedTournament,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
    }));
    // Eliminar un torneo
    router.delete(`${exports.endPointTournaments}/:id`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const deletedTournament = yield prisma.tournaments.delete({
                where: { id },
            });
            const response = {
                message: "Torneo eliminado exitosamente",
                data: deletedTournament,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return reply
                    .status(500)
                    .send({ message: "Error del servidor: " + error.message });
            }
        }
    }));
    router.post(`${exports.endPointTournaments}/:id/generate-fixture`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const tournament = yield prisma.tournaments.findUnique({
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
            const teams = tournament.tournamentClubs.map((clubCategory) => clubCategory.club);
            if (teams.length < 2) {
                return reply.status(400).send({
                    message: "El torneo debe tener al menos 2 equipos registrados para generar el fixture.",
                });
            }
            if (teams.length % 2 !== 0) {
                return reply.status(400).send({
                    message: "El número de equipos debe ser par para generar el fixture. Registre un equipo adicional.",
                });
            }
            // Distribuir fechas de partidos entre las fechas de inicio y fin del torneo
            const totalDays = Math.ceil((new Date(tournament.dateEnd).getTime() -
                new Date(tournament.dateStart).getTime()) /
                86400000);
            if (totalDays < teams.length / 2) {
                return reply.status(400).send({
                    message: "El rango de fechas del torneo no es suficiente para programar todos los partidos.",
                });
            }
            const shuffledTeams = teams.sort(() => Math.random() - 0.5); // Mezclar los equipos aleatoriamente
            const fixtures = [];
            let currentDate = new Date(tournament.dateStart);
            for (let i = 0; i < shuffledTeams.length; i += 2) {
                if (i + 1 < shuffledTeams.length) {
                    // Asegurar que la fecha no exceda la fecha de finalización del torneo
                    if (currentDate > new Date(tournament.dateEnd))
                        break;
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
            const createdGames = yield prisma.game.createMany({
                data: fixtures,
            });
            // Marcar el fixture como generado
            yield prisma.tournaments.update({
                where: { id },
                data: { fixtureGenerated: true },
            });
            const tournamentRes = yield prisma.tournaments.findUnique({
                where: {
                    id,
                },
                include: {
                    format: true,
                    finalFormat: true,
                    category: true,
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
            const response = {
                message: "Fixture generado exitosamente.",
                data: tournamentRes,
                status: 201,
            };
            return reply.status(201).send(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return reply
                    .status(500)
                    .send({ message: "Error del servidor: " + error.message });
            }
        }
    }));
}
