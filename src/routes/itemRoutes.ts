import { FastifyInstance } from 'fastify';
import {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
} from '../controllers/items.js';
import items from '../items.js';

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

// Options for add item
const postItemOpts = {
  schema: {
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
  handler: addItem,
};

// Options for delete item
const deleteItemOpts = {
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
  handler: deleteItem,
};
// Options for update item
const updateItemOpts = {
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
  handler: updateItem,
};
// Routes for items
export default async function itemRoutes(
  fastify: FastifyInstance,
): Promise<void> {
  // get all items
  fastify.get('/items', getItemsOpts);

  // get item by ID
  fastify.get<{ Params: { id: string } }>('/items/:id', getItemByIdOpts);

  // Add item
  fastify.post('/items', postItemOpts);

  // delete item by ID
  fastify.delete<{ Params: { id: string } }>('/items/:id', deleteItemOpts);

  // update item by ID
  fastify.put<{ Params: { id: string }; Body: { name: string } }>(
    '/items/:id',
    updateItemOpts,
  );
}
