import { randomBytes } from 'node:crypto'
import type { Order, OrderLine, PaymentMethod, ShippingMethod } from '~~/types/types'

const round2 = (n: number) => Math.round(n * 100) / 100

export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  const body = await readBody(event)

  if (!Array.isArray(body?.items) || body.items.length === 0) badRequest('Your bag is empty')
  if (body.items.length > 50) badRequest('Too many items in one order')

  const contact = {
    email: requireEmail(body.contact?.email),
    phone: requireString(body.contact?.phone, 'Phone', { min: 6, max: 30 }),
  }
  const a = body.shippingAddress ?? {}
  const shippingAddress = {
    firstName: requireString(a.firstName, 'First name', { max: 60 }),
    lastName: requireString(a.lastName, 'Last name', { max: 60 }),
    country: requireString(a.country, 'Country', { max: 60 }),
    region: requireString(a.region, 'State / Region', { max: 60 }),
    address: requireString(a.address, 'Address', { max: 200 }),
    city: requireString(a.city, 'City', { max: 80 }),
    postalCode: requireString(a.postalCode, 'Postal code', { max: 20 }),
  }
  const shippingMethod = requireOneOf<ShippingMethod>(body.shippingMethod, ['standard', 'express'], 'Shipping method')
  const paymentMethod = requireOneOf<PaymentMethod>(body.paymentMethod, ['card', 'cod'], 'Payment method')

  // Never trust client prices: every line is re-priced from the catalog
  const items: OrderLine[] = []
  for (const raw of body.items) {
    const product = await findProduct(Number(raw?.productId))
    if (!product) badRequest('One of the products in your bag no longer exists')
    const quantity = Number(raw.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) badRequest(`Invalid quantity for ${product.title}`)
    const size = product.sizes.find((s) => s.label === raw.size)
    if (!size?.available) badRequest(`${product.title} is not available in size ${raw.size}`)
    if (quantity > product.stock) badRequest(`Only ${product.stock} left of ${product.title}`)

    items.push({
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      size: size.label,
      quantity,
      unitPrice: product.price,
      lineTotal: round2(product.price * quantity),
    })
  }

  const subtotal = round2(items.reduce((sum, i) => sum + i.lineTotal, 0))
  const shipping = shippingCost(shippingMethod, subtotal)

  const order: Order = {
    id: `NW-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`,
    userId: user?.id ?? null,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    items,
    contact,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    subtotal,
    shipping,
    total: round2(subtotal + shipping),
  }

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
