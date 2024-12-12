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
exports.endPointTypeOfPass = void 0;
exports.typeOfPassRoutes = typeOfPassRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.endPointTypeOfPass = "/typeofpass";
function typeOfPassRoutes(router) {
    router.get(exports.endPointTypeOfPass, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const typeOfPass = yield prisma.typeOfPass.findMany();
            const response = {
                message: "Tipos de pase obtenidos exitosamente",
                data: typeOfPass,
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
}
