import Fastify from 'fastify';
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

function buildServer() {
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

// Export the Vercel-compatible handler
export default async function handler(req:any, res:any) {
    const app = buildServer();
    await app.ready(); // Ensure the server is initialized
    app.server.emit('request', req, res); // Forward the request to Fastify
}
