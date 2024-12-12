
import Fastify from 'fastify';
import cors from '@fastify/cors'
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

const server = Fastify({ logger: true });


async function main() {

    server.register(cors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    })

    server.get('/', async (request, reply) => {
        return reply.send({ service: 'welcome to soccer world' });
    });
    usersRoutes(server)
    categoryRoutes(server);
    clubRoutes(server);
    clubCategoriesRoutes(server);
    typeOfPassRoutes(server);
    playerRoutes(server);
    historyPlayerRoutes(server);
    formatRoutes(server);
    tournamentRoutes(server);
    gameRoutes(server);
    //clubCategoriesRoutes(server);

    try {
        server.listen({ host: config.address, port: config.port }, (err) => { if (err) throw err })
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }

    
}


main()


export default main;



