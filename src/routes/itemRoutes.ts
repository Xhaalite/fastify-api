import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import items from '../items';
import { getItems, getItem } from '../controllers/items';

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
  handler: getItems,
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
  handler: getItem,
};

// Routes for items
export default function itemRoutes(fastify: FastifyInstance, done: () => void) {
  // get all items
  fastify.get('/items', getItemsOpts);

  // get item by ID
  fastify.get<{ Params: { id: string } }>('/items/:id', getItemByIdOpts);

  done();
}
