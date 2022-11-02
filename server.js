const fastify = require('fastify')();

const conf = require("./conf.js");
const { getTrackedAddresses, getNewAddressesByDate } = require('./services/trackedAddressesService.js');

fastify.get('/tracked_addresses', async (request, reply) => {
  if(!request.query.from_date) {
    reply.code(400).send({ error: 'from_date is required request query param!' });
    return;
  }

  try {
    const trackedAddresses = await getTrackedAddresses(request.query.from_date, request.query.to_date);

    reply.code(200).send(trackedAddresses);
  } catch (error) {
    reply.code(400).send({ error });
  } 
})

fastify.get('/new_addresses_by_day', async (request, reply) => {
  if(!request.query.from_date) {
    reply.code(400).send({ error: 'from_date is required request query params!' });
    return;
  }

  try {
    const stats = await getNewAddressesByDate(request.query.from_date, request.query.to_date);

    reply.code(200).send(stats);
  } catch (error) {
    reply.code(400).send({ error });
  }
})

const launch = async () => {
  try {
    await fastify.listen({ port: conf.webPort, host: conf.webHost })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

exports.launchServer = launch;
