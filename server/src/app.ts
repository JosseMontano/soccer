
import Fastify from 'fastify';
import cors from '@fastify/cors'
import { categoryRoutes } from './app/categories/categories.controller';
import { config } from './common/config/config';
import { clubRoutes } from './app/clubs/clubs.controller';

const server = Fastify({ logger: true });


async function main() {

    server.register(cors, { 
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      })

    server.get('/', async (request, reply) => {
        return reply.send({ service: 'welcome to soccer world' });
    });

    categoryRoutes(server);
    clubRoutes(server);

    try {
        server.listen({host:config.address, port: config.port}, (err) => { if (err) throw err })
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }

}


main()


export default main;

 

 