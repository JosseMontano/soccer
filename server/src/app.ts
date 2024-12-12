import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

app.get('/', async (req, res) => {
  return res.send({ service: 'welcome to soccer world' });
})

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}