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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function seedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = [
            { id: "1", name: "superAdmin" },
            { id: "2", name: "admin" },
            { id: "3", name: "manager" },
            { id: "4", name: "user" },
        ];
        for (const v of roles) {
            yield prisma.roles.create({
                data: {
                    id: v.id,
                    name: v.name,
                },
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash("123456", 10);
        yield prisma.users.create({
            data: {
                email: "superadmin@gmail.com",
                password: hashedPassword,
                roleId: roles[0].id,
            },
        });
    });
}
seedUsers()
    .catch((e) => {
    console.error("Error al insertar las semillas de users:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
