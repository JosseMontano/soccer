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
exports.endPointPlayers = void 0;
exports.playerRoutes = playerRoutes;
const client_1 = require("@prisma/client");
const player_validations_1 = require("./player.validations");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.endPointPlayers = "/players";
function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
function playerRoutes(router) {
    router.get(exports.endPointPlayers, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const players = yield prisma.player.findMany({
                include: {
                    club: true,
                },
            });
            const fullData = players.map((v) => {
                return Object.assign({ age: calculateAge(v.birthdate.toString()) }, v);
            });
            const response = {
                message: "Jugadores obtenidos exitosamente",
                data: fullData,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error " + error.message });
        }
    }));
    // Create a new player
    router.post(exports.endPointPlayers, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            player_validations_1.playerSchema.parse(data);
            console.log(data);
            // Calculate the player's age
            const age = calculateAge(data.birthdate);
            // Get the club's category
            const clubCategory = yield prisma.clubCategories.findFirst({
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
                if ((isMale && data.gender !== "male") ||
                    (!isMale && data.gender !== "female")) {
                    return reply.status(400).send({
                        message: `El género del jugador no coincide con la categoría del club (${typeCategory.name}).`,
                    });
                }
            }
            // Create the player
            const newPlayer = yield prisma.player.create({
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
                include: {
                    club: true,
                },
            });
            // Automatically create HistoryPlayer record
            yield prisma.historyPlayer.create({
                data: {
                    playerId: newPlayer.id,
                    clubId: data.clubId,
                    typeOfPassId: yield getDefaultPassTypeId(), // Default pass type (e.g., "Definitivo")
                    active: true,
                    startDate: new Date(),
                    goals: 0,
                    yellowCards: 0,
                    redCards: 0,
                    matchesPlayed: 0,
                },
            });
            const response = {
                message: "Jugador creado exitosamente",
                data: Object.assign(Object.assign({}, newPlayer), { age }),
                status: 201,
            };
            return reply.status(201).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
    }));
    // Update a player by ID
    router.put(exports.endPointPlayers + "/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const data = request.body;
            player_validations_1.playerSchema.parse(data);
            // Calculate the player's age
            const age = calculateAge(data.birthdate);
            // Get the club's category
            const clubCategory = yield prisma.clubCategories.findFirst({
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
                if ((isMale && data.gender !== "male") ||
                    (!isMale && data.gender !== "female")) {
                    return reply.status(400).send({
                        message: `El género del jugador no coincide con la categoría del club (${typeCategory.name}).`,
                    });
                }
            }
            const updatedPlayer = yield prisma.player.update({
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
                include: {
                    club: true,
                },
            });
            const response = {
                message: "Jugador actualizado exitosamente",
                data: Object.assign(Object.assign({}, updatedPlayer), { age }),
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
    }));
    // Delete a player by ID
    router.delete(exports.endPointPlayers + "/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            yield prisma.historyPlayer.deleteMany({
                where: { playerId: id },
            });
            const deletedPlayer = yield prisma.player.delete({
                where: { id: id },
            });
            const response = {
                message: "Jugador eliminado exitosamente",
                data: deletedPlayer,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error " + error.message });
        }
    }));
}
// Helper to get the default pass type ID
function getDefaultPassTypeId() {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultPass = yield prisma.typeOfPass.findFirst({
            where: { name: "Definitivo" },
        });
        if (!defaultPass) {
            throw new Error("Tipo de pase 'Definitivo' no encontrado.");
        }
        return defaultPass.id;
    });
}
