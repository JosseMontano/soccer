
import Fastify from 'fastify';
import cors from '@fastify/cors'
import { categoryRoutes } from './app/categories/categories.controller';
import { config } from './common/config/config';

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

    try {
        server.listen({host:config.address, port: config.port}, (err) => { if (err) throw err })
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }

}


main()


export default main;

 

 