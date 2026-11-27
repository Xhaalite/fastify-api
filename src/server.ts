import Fastify, { FastifyInstance, FastifyListenOptions } from 'fastify';
import itemRoutes from './routes/itemRoutes';

// import items from './items';

const fastify: FastifyInstance = Fastify({ logger: true });
fastify.register((instance, _opts, done) => {
  itemRoutes(instance, done);
});

const listenOptions: FastifyListenOptions = {
  port: 5000,
  host: '0.0.0.0',
};

const start = async (): Promise<void> => {
  try {
    const address: string = await fastify.listen(listenOptions);
    fastify.log.info(`Server listening at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
