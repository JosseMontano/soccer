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
exports.endpoint = void 0;
exports.clubCategoriesRoutes = clubCategoriesRoutes;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.endpoint = "/club-categories";
function clubCategoriesRoutes(router) {
    // Obtener todas las categorías de un club
    router.get(exports.endpoint + "/:clubId", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { clubId } = request.params;
            const data = yield prisma.clubCategories.findMany({
                where: {
                    clubId: clubId,
                },
                include: {
                    category: { include: { typeCategory: true } },
                },
            });
            const response = {
                message: "Categorías del club obtenidas exitosamente",
                data: data,
                status: 200,
            };
            reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error: " + error.message });
        }
    }));
    // Actualizar categorías de un club
    router.put(exports.endpoint + "/:clubId", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const schema = zod_1.z.object({
            categories: zod_1.z.string().array(),
        });
        try {
            const { clubId } = request.params;
            const parsedBody = schema.safeParse(request.body);
            if (!parsedBody.success) {
                return reply.status(400).send({ message: "Categorías no válidas", errors: parsedBody.error.errors });
            }
            // Verificar si todas las categorías existen
            const categories = yield prisma.categories.findMany({
                where: {
                    id: {
                        in: parsedBody.data.categories,
                    },
                },
            });
            if (parsedBody.data.categories.length !== categories.length) {
                return reply.status(400).send({ message: "Alguna(s) categoría(s) no encontrada(s)", data: [], status: 400 });
            }
            // Eliminar las categorías anteriores del club
            yield prisma.clubCategories.deleteMany({
                where: {
                    clubId: clubId,
                },
            });
            // Agregar las nuevas categorías
            const data = yield prisma.clubCategories.createMany({
                data: parsedBody.data.categories.map((categoryId) => {
                    return {
                        categoryId: categoryId,
                        clubId: clubId,
                    };
                }),
            });
            const response = {
                message: "Categorías del club actualizadas exitosamente",
                data: data,
                status: 200,
            };
            reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ message: "Server error: " + error.message });
        }
    }));
}
