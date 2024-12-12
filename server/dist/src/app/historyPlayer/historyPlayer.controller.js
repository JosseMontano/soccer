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
exports.endPointHistoryPlayer = void 0;
exports.historyPlayerRoutes = historyPlayerRoutes;
const client_1 = require("@prisma/client");
const historyPlayer_validations_1 = require("./historyPlayer.validations");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.endPointHistoryPlayer = "/historyPlayer";
function historyPlayerRoutes(router) {
    // Obtener el historial completo de un jugador
    router.get(`${exports.endPointHistoryPlayer}/:playerId`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { playerId } = request.params;
            const history = yield prisma.historyPlayer.findMany({
                where: { playerId },
                include: {
                    club: true,
                    typeOfPass: true,
                },
            });
            // Calcular estadísticas totales
            const totalStats = history.reduce((totals, record) => {
                totals.totalGoals += record.goals || 0;
                totals.totalYellowCards += record.yellowCards || 0;
                totals.totalRedCards += record.redCards || 0;
                return totals;
            }, { totalGoals: 0, totalYellowCards: 0, totalRedCards: 0 });
            const response = {
                message: "Historial completo del jugador obtenido exitosamente",
                data: { history, totalStats },
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            return reply
                .status(500)
                .send({ message: "Error del servidor: " + error.message });
        }
    }));
    // Crear un nuevo registro de historial
    router.post(exports.endPointHistoryPlayer, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const data = historyPlayer_validations_1.historyPlayerSchema.parse(request.body);
            // Validar que el club y el jugador pertenezcan a la misma categoría
            const club = yield prisma.club.findUnique({
                where: { id: data.clubId },
                include: { clubCategories: { include: { category: true } } },
            });
            if (!club) {
                return reply
                    .status(404)
                    .send({ message: "El club especificado no existe" });
            }
            const player = yield prisma.player.findUnique({
                where: { id: data.playerId },
                include: { club: { include: { clubCategories: { include: { category: true } } } } },
            });
            if (!player) {
                return reply
                    .status(404)
                    .send({ message: "El jugador especificado no existe" });
            }
            const clubCategory = (_a = club.clubCategories[0]) === null || _a === void 0 ? void 0 : _a.category.id;
            const playerCategory = (_b = player.club.clubCategories[0]) === null || _b === void 0 ? void 0 : _b.category.id;
            if (clubCategory !== playerCategory) {
                return reply.status(400).send({
                    message: "El club y el jugador deben pertenecer a la misma categoría.",
                });
            }
            // Validar fechas de inicio y fin
            if (new Date(data.endDate || "") <= new Date(data.startDate)) {
                return reply.status(400).send({
                    message: "La fecha de fin debe ser posterior a la fecha de inicio.",
                });
            }
            // Verificar superposición de fechas en historial existente
            const overlappingHistory = yield prisma.historyPlayer.findMany({
                where: {
                    playerId: data.playerId,
                    OR: [
                        {
                            startDate: {
                                lte: new Date(data.endDate || new Date()),
                            },
                            endDate: {
                                gte: new Date(data.startDate),
                            },
                        },
                        {
                            endDate: null,
                            active: true,
                        },
                    ],
                },
            });
            if (overlappingHistory.length > 0) {
                return reply.status(400).send({
                    message: "Ya existe un registro de historial activo o con fechas superpuestas.",
                });
            }
            // Desactivar historial previo si el jugador está cambiando de club
            yield prisma.historyPlayer.updateMany({
                where: { playerId: data.playerId, active: true },
                data: { active: false },
            });
            // Crear nuevo registro de historial
            const newHistory = yield prisma.historyPlayer.create({
                data: {
                    playerId: data.playerId,
                    clubId: data.clubId,
                    typeOfPassId: data.typeOfPassId,
                    active: data.active,
                    startDate: new Date(data.startDate),
                    endDate: data.endDate ? new Date(data.endDate) : null,
                    goals: data.goals || 0,
                    yellowCards: data.yellowCards || 0,
                    redCards: data.redCards || 0,
                    matchesPlayed: data.matchesPlayed || 0,
                },
            });
            const response = {
                message: "Historial creado exitosamente",
                data: newHistory,
                status: 201,
            };
            return reply.status(201).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    message: `Error de validación: ${err.message}`,
                }));
                return reply.status(400).send({ errors: errorMessages });
            }
            return reply
                .status(500)
                .send({ message: "Error del servidor: " + error.message });
        }
    }));
}
