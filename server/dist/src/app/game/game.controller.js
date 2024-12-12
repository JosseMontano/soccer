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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPointGameEvents = void 0;
exports.gameRoutes = gameRoutes;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const pusher_1 = __importDefault(require("../../utils/pusher"));
const prisma = new client_1.PrismaClient();
exports.endPointGameEvents = "/games/events";
function gameRoutes(router) {
    // Agregar un nuevo evento de jugador
    router.post(`${exports.endPointGameEvents}`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { gameId, playerId, eventType } = request.body;
            // Validar existencia del partido
            const game = yield prisma.game.findUnique({
                where: { id: gameId },
                include: {
                    firstTeam: true,
                    secondTeam: true,
                },
            });
            if (!game) {
                return reply.status(404).send({ message: "El partido no existe." });
            }
            // Validar existencia del jugador
            const player = yield prisma.player.findUnique({
                where: { id: playerId },
                include: {
                    historyPlayers: {
                        where: { active: true },
                    },
                },
            });
            if (!player) {
                return reply.status(404).send({ message: "El jugador no existe." });
            }
            const activeHistory = player.historyPlayers[0];
            if (!activeHistory) {
                return reply.status(400).send({
                    message: "El jugador no tiene un club activo registrado.",
                });
            }
            // Validar que el jugador pertenece a uno de los equipos en el partido
            if (activeHistory.clubId !== game.firstTeamId &&
                activeHistory.clubId !== game.secondTeamId) {
                return reply.status(400).send({
                    message: "El jugador no pertenece a ninguno de los equipos en este partido.",
                });
            }
            // Crear el evento
            const newEvent = yield prisma.gameEvent.create({
                data: {
                    gameId,
                    playerId,
                    eventType,
                },
            });
            // Actualizar estadísticas del jugador en el HistoryPlayer
            const updateStats = {
                goal: { goals: { increment: 1 } },
                yellow_card: { yellowCards: { increment: 1 } },
                red_card: { redCards: { increment: 1 } },
                foul: {}, // Las faltas no afectan al HistoryPlayer directamente
            }[eventType];
            if (Object.keys(updateStats).length > 0) {
                yield prisma.historyPlayer.update({
                    where: { id: activeHistory.id },
                    data: updateStats,
                });
            }
            const response = {
                message: "Evento de jugador registrado y estadísticas actualizadas exitosamente",
                data: newEvent,
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
            return reply.status(500).send({ message: `Server error: ${error} ` });
        }
    }));
    router.post(`${exports.endPointGameEvents}/prediction`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract data from the request body
            const { amountVictoriesTeam1, amountVictoriesTeam2 } = request.body;
            // Validate input
            if (amountVictoriesTeam1 === undefined ||
                amountVictoriesTeam2 === undefined) {
                return reply.status(400).send({
                    message: "Tanto amountVictoriesTeam1 y amountVictoriesTeam2 son requeridos",
                });
            }
            // Send data to the prediction API
            const response = yield fetch("http://0.0.0.0:5000/api/prediction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    amountVictoriesTeam1,
                    amountVictoriesTeam2,
                }),
            });
            // Parse response from the external API
            const result = yield response.json();
            // Handle errors from the external API
            if (!response.ok) {
                const errorBody = yield response.text();
                console.error("Error body:", errorBody);
                return reply.status(response.status).send({ message: errorBody });
            }
            // Send the result back to the client
            return reply.status(200).send({
                message: "Prediccion Generada exitosamente",
                data: result.data,
                status: result.status,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: "An unexpected error occurred.",
                    error: error.message,
                });
            }
        }
    }));
    // Obtener eventos de un partido
    router.get(`${exports.endPointGameEvents}/:gameId`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { gameId } = request.params;
            const events = yield prisma.gameEvent.findMany({
                where: { gameId },
                include: {
                    player: true, // Incluye información del jugador
                },
            });
            if (!events.length) {
                return reply.status(404).send({
                    message: "No se encontraron eventos para este partido.",
                });
            }
            const response = {
                message: "Eventos del partido obtenidos exitosamente",
                data: events,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            return reply.status(500).send({ message: `Server error: ${error}` });
        }
    }));
    // Obtener todos los partidos de un torneo
    router.get("/games/tournament/:tournamentId", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { tournamentId } = request.params;
            const games = yield prisma.game.findMany({
                where: { tournamentId },
                orderBy: { date: "asc" },
                include: {
                    firstTeam: true,
                    secondTeam: true,
                },
            });
            if (games.length === 0) {
                return reply.status(404).send({
                    message: "No hay partidos para este torneo.",
                });
            }
            const response = {
                message: "Partidos del torneo obtenidos exitosamente",
                data: games,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            return reply.status(500).send({ message: `Server error: ${error}` });
        }
    }));
    // Obtener un partido específico
    router.get("/games/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const game = yield prisma.game.findUnique({
                where: { id },
                include: {
                    firstTeam: true,
                    secondTeam: true,
                    tournament: true,
                },
            });
            if (!game) {
                return reply.status(404).send({
                    message: "El partido no existe.",
                });
            }
            const response = {
                message: "Partido obtenido exitosamente",
                data: game,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            return reply.status(500).send({ message: `Server error: ${error}` });
        }
    }));
    // Agregar o disminuir goles de un equipo
    router.put(`${exports.endPointGameEvents}/:gameId/goals`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { gameId } = request.params;
            const { team, action } = request.body;
            // Validar que los parámetros sean correctos
            if (!["firstTeam", "secondTeam"].includes(team)) {
                return reply.status(400).send({
                    message: "El equipo debe ser 'firstTeam' o 'secondTeam'.",
                });
            }
            if (!["increment", "decrement"].includes(action)) {
                return reply.status(400).send({
                    message: "La acción debe ser 'increment' o 'decrement'.",
                });
            }
            // Validar existencia del partido
            const game = yield prisma.game.findUnique({
                where: { id: gameId },
            });
            if (!game) {
                return reply.status(404).send({
                    message: "El partido no existe.",
                });
            }
            // Actualizar goles del equipo correspondiente, action can be increment o decrement
            const updateData = team === "firstTeam"
                ? { goalsFirstTeam: { [action]: 1 } }
                : { goalsSecondTeam: { [action]: 1 } };
            const updatedGame = yield prisma.game.update({
                where: { id: gameId },
                data: updateData,
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
                    }
                }
            });
            yield pusher_1.default.trigger('goal-channel', `new-goal`, {
                tournamentId: updatedGame.tournamentId,
                gameId: updatedGame.id,
                team,
                action,
                newGoals: {
                    firstTeam: updatedGame.goalsFirstTeam,
                    secondTeam: updatedGame.goalsSecondTeam
                }[team]
            });
            const response = {
                message: `Goles del equipo ${team} actualizados exitosamente.`,
                data: updatedGame,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            return reply.status(500).send({
                message: `Server error: ${error}`,
            });
        }
    }));
}
