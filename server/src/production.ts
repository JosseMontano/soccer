import Fastify from 'fastify'
import { usersRoutes } from './app/users/users.controller';
import { categoryRoutes } from './app/categories/categories.controller';
import { clubRoutes } from './app/clubs/clubs.controller';
import { clubCategoriesRoutes } from './app/clubsCategories/clubs.controller';
import { typeOfPassRoutes } from './app/typeOfPass/typeOfPass.controller';
import { playerRoutes } from './app/player/player.controller';
import { historyPlayerRoutes } from './app/historyPlayer/historyPlayer.controller';
import { formatRoutes } from './app/format/format.controller';
import { tournamentRoutes } from './app/tournaments/tournament.controller';
import { gameRoutes } from './app/game/game.controller';

const app = Fastify({
  logger: true,
})

app.get('/', async (req, res) => {
  return res.send({ service: 'welcome to soccer world' });
})

usersRoutes(app);
categoryRoutes(app);
clubRoutes(app);
clubCategoriesRoutes(app);
typeOfPassRoutes(app);
playerRoutes(app);
historyPlayerRoutes(app);
formatRoutes(app);
tournamentRoutes(app);
gameRoutes(app);

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}