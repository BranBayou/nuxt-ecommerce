// Shared by the storefront (estimates) and the orders API (source of truth)
import type { ShippingMethod } from '../types/types'

export const FREE_SHIPPING_THRESHOLD = 150

export const SHIPPING_OPTIONS: Record<ShippingMethod, { label: string; eta: string }> = {
  standard: { label: 'Standard', eta: '3–5 business days' },
  express: { label: 'Express', eta: '1–2 business days' },
}

export function shippingCost(method: ShippingMethod, subtotal: number) {
  if (method === 'express') return 19.99
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99
}
