export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  const order = buildOrder(await getCatalog(), await readBody(event), user)

  const db = useDb()
  await db.setItem(`orders:${order.id}`, order)
  if (user) {
    const key = userOrdersKey(user.id)
    const ids = (await db.getItem<string[]>(key)) ?? []
    await db.setItem(key, [order.id, ...ids])
  }

  setResponseStatus(event, 201)
  return { order }
})
