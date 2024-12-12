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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const categories_controller_1 = require("./app/categories/categories.controller");
const config_1 = require("./common/config/config");
const clubs_controller_1 = require("./app/clubs/clubs.controller");
const clubs_controller_2 = require("./app/clubsCategories/clubs.controller");
const typeOfPass_controller_1 = require("./app/typeOfPass/typeOfPass.controller");
const player_controller_1 = require("./app/player/player.controller");
const historyPlayer_controller_1 = require("./app/historyPlayer/historyPlayer.controller");
const format_controller_1 = require("./app/format/format.controller");
const tournament_controller_1 = require("./app/tournaments/tournament.controller");
const game_controller_1 = require("./app/game/game.controller");
const users_controller_1 = require("./app/users/users.controller");
const server = (0, fastify_1.default)({ logger: true });
// Register plugins
server.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});
// Define routes
server.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return reply.send({ service: 'welcome to soccer world' });
}));
// Register application routes
(0, users_controller_1.usersRoutes)(server);
(0, categories_controller_1.categoryRoutes)(server);
(0, clubs_controller_1.clubRoutes)(server);
(0, clubs_controller_2.clubCategoriesRoutes)(server);
(0, typeOfPass_controller_1.typeOfPassRoutes)(server);
(0, player_controller_1.playerRoutes)(server);
(0, historyPlayer_controller_1.historyPlayerRoutes)(server);
(0, format_controller_1.formatRoutes)(server);
(0, tournament_controller_1.tournamentRoutes)(server);
(0, game_controller_1.gameRoutes)(server);
// Export the server as the default export for Vercel
exports.default = server;
// Start the server locally if running as a script
if (require.main === module) {
    const port = process.env.PORT || config_1.config.port;
    const address = config_1.config.address;
    //@ts-ignore
    server.listen({ port, host: address }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        console.log(`Server running locally at ${address}`);
    });
}
