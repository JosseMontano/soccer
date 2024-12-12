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
exports.endPointClubs = void 0;
exports.clubRoutes = clubRoutes;
const client_1 = require("@prisma/client");
const clubs_validations_1 = require("./clubs.validations");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.endPointClubs = "/clubs";
function clubRoutes(router) {
    // Get all clubs
    router.get(exports.endPointClubs, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const clubs = yield prisma.club.findMany({
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
        }
        catch (error) {
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: "Server error " + error.message });
        }
    }));
    router.get(exports.endPointClubs + "/category/:categoryId", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoryId } = request.params;
            const clubs = yield prisma.club.findMany({
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
            const response = {
                message: "Clubs obtenidos exitosamente para la categoría especificada",
                data: clubs,
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
    router;
    router.get(exports.endPointClubs + "/select", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const clubs = yield prisma.club.findMany({
                include: {
                    clubCategories: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
            // Transformar los datos al formato deseado
            const transformedData = clubs.flatMap((club) => club.clubCategories.map((clubCategory) => {
                const { name: categoryName, minAge, maxAge } = clubCategory.category;
                return {
                    clubId: club.id,
                    value: `${club.name} | ${categoryName} | ${minAge} a ${maxAge} años`,
                };
            }));
            const response = {
                message: "Clubs obtenidos exitosamente",
                data: transformedData,
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
    // Create a new club
    router.post(exports.endPointClubs, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            clubs_validations_1.clubSchema.parse(data);
            const newClub = yield prisma.club.create({
                data: {
                    name: data.name,
                    logo: data.logo,
                },
            });
            const clubCategory = yield prisma.clubCategories.create({
                data: {
                    clubId: newClub.id,
                    categoryId: data.categoryId,
                },
            });
            const response = {
                message: "Club creado exitosamente",
                data: {
                    club: newClub,
                    clubCategory,
                },
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
    router.put(exports.endPointClubs + "/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const data = request.body;
            clubs_validations_1.clubSchema.parse(data);
            const updatedClub = yield prisma.club.update({
                where: { id: id },
                data: {
                    name: data.name,
                    logo: data.logo,
                },
            });
            const response = {
                message: "Club actualizado exitosamente",
                data: updatedClub,
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
    // Delete a club by ID
    router.delete(exports.endPointClubs + "/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const deletedClub = yield prisma.club.delete({
                where: { id: id },
            });
            const response = {
                message: "Club eliminado exitosamente",
                data: deletedClub,
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
