import 'dotenv/config';
import Fastify, { FastifyInstance, FastifyListenOptions } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import itemRoutes from './routes/itemRoutes';

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Fastify API',
      version: '1.0.0',
    },
  },
});

fastify.register(itemRoutes);
fastify.register(swaggerUi, { routePrefix: '/docs' });

const port = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error('PORT must be an integer between 0 and 65535');
}
const listenOptions: FastifyListenOptions = {
  port,
  host: process.env.HOST ?? '127.0.0.1',
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
