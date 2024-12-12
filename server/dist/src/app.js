"use strict";
/* import Fastify from 'fastify';
import cors from '@fastify/cors';
import { categoryRoutes } from './app/categories/categories.controller';
import { config } from './common/config/config';
import { clubRoutes } from './app/clubs/clubs.controller';
import { clubCategoriesRoutes } from './app/clubsCategories/clubs.controller';
import { typeOfPassRoutes } from './app/typeOfPass/typeOfPass.controller';
import { playerRoutes } from './app/player/player.controller';
import { historyPlayerRoutes } from './app/historyPlayer/historyPlayer.controller';
import { formatRoutes } from './app/format/format.controller';
import { tournamentRoutes } from './app/tournaments/tournament.controller';
import { gameRoutes } from './app/game/game.controller';
import { usersRoutes } from './app/users/users.controller';

let server:any;

export function buildServer() {
    if (!server) {
        server = Fastify({ logger: true });

        // Register plugins
        server.register(cors, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        });

        // Define routes
        server.get('/', async (request:any, reply:any) => {
            return reply.send({ service: 'welcome to soccer world' });
        });

        // Register application routes
        usersRoutes(server);
        categoryRoutes(server);
        clubRoutes(server);
        clubCategoriesRoutes(server);
        typeOfPassRoutes(server);
        playerRoutes(server);
        historyPlayerRoutes(server);
        formatRoutes(server);
        tournamentRoutes(server);
        gameRoutes(server);
    }

    return server;
}

if (require.main === module) {
    // Run the server
    const localServer = buildServer();

    // Use Vercel's dynamic port if available
    const port = process.env.PORT || config.port; // Default to config.port for local testing
    const address = config.address;

    localServer.listen({ port, host: address }, (err:any, address:string) => {
        if (err) {
            localServer.log.error(err);
            process.exit(1);
        }
        console.log(`Server running at ${address}`);
    });
}
 */
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
const config_1 = require("./common/config/config");
const server = (0, fastify_1.default)({ logger: true });
const test = false;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        server.register(cors_1.default, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        });
        server.get('/', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.send({ service: 'welcome to SIVI' });
        }));
        /*     companyRoutes(server);
            ComCategoriesRoues(server)
            authRoutes(server)
            companiesComCategoriesRoutes(server)
            userRoutes(server)
            commentRoutes(server)
            prodCategoryRoutes(server)
            productRoutes(server) */
        if (test) {
            return server;
        }
        try {
            server.listen({ host: config_1.config.address, port: config_1.config.port }, (err) => { if (err)
                throw err; });
        }
        catch (err) {
            server.log.error(err);
            process.exit(1);
        }
    });
}
//if you wanna run the test, gotta comment the main()
main();
exports.default = main;
