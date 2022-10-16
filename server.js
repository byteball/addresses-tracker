const fastify = require('fastify')();
const { getTrackedAddresses } = require('./services/trackedAddressesService.js');

fastify.get('/tracked_addresses', async (request, reply) => {
  const fromTimestamp = request.query.from_timestamp || null;
  const toTimestamp = request.query.to_timestamp || null;
  
  const trackedAddresses = await getTrackedAddresses(fromTimestamp, toTimestamp);

  reply.code(200).send(trackedAddresses);
})

const launch = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

exports.launchServer = launch;
