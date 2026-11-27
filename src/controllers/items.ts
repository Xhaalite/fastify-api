import { FastifyRequest, FastifyReply } from 'fastify';
import items from '../items';
export function getItems(request: FastifyRequest, reply: FastifyReply) {
  reply.send(items);
}

export function getItem(
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
}
