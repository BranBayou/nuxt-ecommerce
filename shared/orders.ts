// Order validation and pricing shared by the Nitro API and the static (GitHub Pages) backend.
// Every line is re-priced from the catalog — client-supplied prices are never trusted.
import type { Order, OrderLine, PaymentMethod, Product, ShippingMethod, User } from '../types/types'
import { shippingCost } from './pricing'
import { badRequest, requireEmail, requireOneOf, requireString } from './validate'

const round2 = (n: number) => Math.round(n * 100) / 100

const randomHex = (bytes: number) =>
  Array.from(globalThis.crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

export const ORDER_ID_RE = /^NW-[A-Z0-9]+-[A-F0-9]{8}$/

export function buildOrder(catalog: Product[], body: any, user: User | null): Order {
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

  const items: OrderLine[] = body.items.map((raw: any) => {
    const product = catalog.find((p) => p.id === Number(raw?.productId))
    if (!product) badRequest('One of the products in your bag no longer exists')
    const quantity = Number(raw.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) badRequest(`Invalid quantity for ${product.title}`)
    const size = product.sizes.find((s) => s.label === raw.size)
    if (!size?.available) badRequest(`${product.title} is not available in size ${raw.size}`)
    if (quantity > product.stock) badRequest(`Only ${product.stock} left of ${product.title}`)

    return {
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      size: size.label,
      quantity,
      unitPrice: product.price,
      lineTotal: round2(product.price * quantity),
    }
  })

  const subtotal = round2(items.reduce((sum, i) => sum + i.lineTotal, 0))
  const shipping = shippingCost(shippingMethod, subtotal)

  return {
    id: `NW-${Date.now().toString(36).toUpperCase()}-${randomHex(4)}`,
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
}
