import type { Order } from '~~/types/types'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const db = useDb()
  const ids = (await db.getItem<string[]>(userOrdersKey(user.id))) ?? []
  const orders = await Promise.all(ids.map((id) => db.getItem<Order>(`orders:${id}`)))
  return { orders: orders.filter((o): o is Order => o !== null) }
})
