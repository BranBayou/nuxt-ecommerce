import type { Order } from '~~/types/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^NW-[A-Z0-9]+-[A-F0-9]{8}$/.test(id)) throw createError({ statusCode: 404, statusMessage: 'Order not found' })

  const order = await useDb().getItem<Order>(`orders:${id}`)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Order not found' })

  // Guest orders are reachable by their unguessable id; account orders only by their owner
  if (order.userId) {
    const user = await getSessionUser(event)
    if (user?.id !== order.userId) throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  return { order }
})
