import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import items from '../items';

const fastify: FastifyInstance = Fastify({ logger: true });

// Options for get all items
const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
  handler: async function (request: FastifyRequest, reply: FastifyReply) {
    reply.send(items);
  },
};

// Options for get item by ID
const getItemByIdOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
  handler: async function (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const item = items.find((item) => item.id === Number(id));
    if (!item) {
      reply.code(404).send({ message: 'Item not found' });
      return;
    }
    reply.send(item);
  },
};

// Routes for items
export default function itemRoutes(fastify: FastifyInstance, done: () => void) {
  // get all items
  fastify.get('/items', getItemsOpts);

  // get item by ID
  fastify.get<{ Params: { id: string } }>('/items/:id', getItemByIdOpts);

  done();
}
