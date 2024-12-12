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
exports.default = handler;
const fastify_1 = __importDefault(require("fastify"));
const users_controller_1 = require("./app/users/users.controller");
const categories_controller_1 = require("./app/categories/categories.controller");
const app = (0, fastify_1.default)({
    logger: true,
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send({ service: 'welcome to soccer world 1' });
}));
(0, users_controller_1.usersRoutes)(app);
(0, categories_controller_1.categoryRoutes)(app);
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield app.ready();
        app.server.emit('request', req, res);
    });
}
