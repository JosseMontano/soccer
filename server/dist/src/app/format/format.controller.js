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
exports.endPointFormats = void 0;
exports.formatRoutes = formatRoutes;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const format_validations_1 = require("./format.validations");
const prisma = new client_1.PrismaClient();
exports.endPointFormats = "/formats";
function formatRoutes(router) {
    // Obtener todos los formatos
    router.get(exports.endPointFormats, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const formats = yield prisma.format.findMany();
            const response = {
                message: "Formatos obtenidos exitosamente",
                data: formats,
                status: 200,
            };
            return reply.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error)
                return reply
                    .status(500)
                    .send({ message: `Server error: ${error.message}` });
        }
    }));
    // Crear un nuevo formato
    router.post(exports.endPointFormats, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = format_validations_1.createFormatSchema.parse(request.body);
            const newFormat = yield prisma.format.create({
                data: {
                    name: data.name,
                },
            });
            const response = {
                message: "Formato creado exitosamente",
                data: newFormat,
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
                    .send({ message: `Server error: ${error.message}` });
        }
    }));
    // Obtener un formato por ID
    router.get(`${exports.endPointFormats}/:id`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = format_validations_1.formatIdSchema.parse(request.params);
            const format = yield prisma.format.findUnique({
                where: { id },
            });
            if (!format) {
                return reply
                    .status(404)
                    .send({ message: "Formato no encontrado", status: 404 });
            }
            const response = {
                message: "Formato obtenido exitosamente",
                data: format,
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
                    .send({ message: `Server error: ${error.message}` });
        }
    }));
}
