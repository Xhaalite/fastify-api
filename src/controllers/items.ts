import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuid } from 'uuid';
import items from '../items.js';
export function getItems(request: FastifyRequest, reply: FastifyReply) {
  reply.send(items);
}

export function getItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const item = items.find((item) => item.id === id);
  if (!item) {
    reply.code(404).send({ message: 'Item not found' });
    return;
  }
  reply.send(item);
}

export function addItem(
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply,
) {
  const { name } = request.body;
  const newItem: { id: string; name: string } = { id: uuid(), name };
  items.push(newItem);
  reply.code(201).send(newItem);
}

export async function deleteItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    reply.code(404).send({ message: 'Item not found' });
    return;
  }
  const deletedItem = items.splice(index, 1);
  reply.send(deletedItem[0]);
}
