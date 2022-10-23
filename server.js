const fastify = require('fastify')();

const conf = require("./conf.js");
const { getTrackedAddresses } = require('./services/trackedAddressesService.js');

fastify.get('/tracked_addresses', async (request, reply) => {
  if(!request.query.from_date || !request.query.to_date) {
    reply.code(400).send({ error: 'from_date and to_date is required request query params!' });
    return;
  }

  try {
    const trackedAddresses = await getTrackedAddresses(request.query.from_date, request.query.to_date);

    reply.code(200).send(trackedAddresses);
  } catch (error) {
    reply.code(400).send({ error });
  } 
})

const launch = async () => {
  try {
    await fastify.listen({ port: conf.webPort })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

exports.launchServer = launch;
