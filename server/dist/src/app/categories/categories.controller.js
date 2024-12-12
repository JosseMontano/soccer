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
exports.endPointCategories = void 0;
exports.categoryRoutes = categoryRoutes;
const client_1 = require("@prisma/client");
const categories_validations_1 = require("./categories.validations");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.endPointCategories = "/categories";
function categoryRoutes(router) {
    // Get all categories
    router.get(exports.endPointCategories, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield prisma.categories.findMany({
                include: {
                    typeCategory: true, // Include typeCategory for context
                },
            });
            const response = {
                message: "Categorías obtenidas exitosamente",
                data: categories,
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
    // Create a new category
    router.post(exports.endPointCategories, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            categories_validations_1.categorySchema.parse(data);
            const newCategory = yield prisma.categories.create({
                data: {
                    name: data.name,
                    typeCategoryId: data.typeCategoryId,
                    minAge: data.minAge,
                    maxAge: data.maxAge,
                },
            });
            const response = {
                message: "Categoría creada exitosamente",
                data: newCategory,
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
    // Update a category by ID
    router.put(exports.endPointCategories + "/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const data = request.body;
            categories_validations_1.categorySchema.parse(data);
            const updatedCategory = yield prisma.categories.update({
                where: { id: id },
                data: {
                    name: data.name,
                    typeCategoryId: data.typeCategoryId,
                    minAge: data.minAge,
                    maxAge: data.maxAge,
                },
            });
            const response = {
                message: "Categoría actualizada exitosamente",
                data: updatedCategory,
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
    // Delete a category by ID
    router.delete(exports.endPointCategories + "/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const deletedCategory = yield prisma.categories.delete({
                where: { id: id },
            });
            const response = {
                message: "Categoría eliminada exitosamente",
                data: deletedCategory,
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
