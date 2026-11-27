import { FastifyInstance } from 'fastify';
import { getItems, getItem } from '../controllers/items';

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
export default async function itemRoutes(
  fastify: FastifyInstance,
): Promise<void> {
  // get all items
  fastify.get('/items', getItemsOpts);

  // get item by ID
  fastify.get<{ Params: { id: string } }>('/items/:id', getItemByIdOpts);

}
