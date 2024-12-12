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
const clubs_controller_1 = require("./app/clubs/clubs.controller");
const clubs_controller_2 = require("./app/clubsCategories/clubs.controller");
const typeOfPass_controller_1 = require("./app/typeOfPass/typeOfPass.controller");
const player_controller_1 = require("./app/player/player.controller");
const historyPlayer_controller_1 = require("./app/historyPlayer/historyPlayer.controller");
const format_controller_1 = require("./app/format/format.controller");
const tournament_controller_1 = require("./app/tournaments/tournament.controller");
const game_controller_1 = require("./app/game/game.controller");
const app = (0, fastify_1.default)({
    logger: true,
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send({ service: 'welcome to soccer world' });
}));
(0, users_controller_1.usersRoutes)(app);
(0, categories_controller_1.categoryRoutes)(app);
(0, clubs_controller_1.clubRoutes)(app);
(0, clubs_controller_2.clubCategoriesRoutes)(app);
(0, typeOfPass_controller_1.typeOfPassRoutes)(app);
(0, player_controller_1.playerRoutes)(app);
(0, historyPlayer_controller_1.historyPlayerRoutes)(app);
(0, format_controller_1.formatRoutes)(app);
(0, tournament_controller_1.tournamentRoutes)(app);
(0, game_controller_1.gameRoutes)(app);
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield app.ready();
        app.server.emit('request', req, res);
    });
}
