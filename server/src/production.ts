import Fastify from 'fastify'
import { usersRoutes } from './app/users/users.controller';
import { categoryRoutes } from './app/categories/categories.controller';

const app = Fastify({
  logger: true,
})

app.get('/', async (req, res) => {
  return res.send({ service: 'welcome to soccer world 1' });
})

usersRoutes(app);
categoryRoutes(app);

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}