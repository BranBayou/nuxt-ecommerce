export { FREE_SHIPPING_THRESHOLD, shippingCost } from '~~/shared/pricing'

// Index of order ids per user; ids are filesystem-safe already
export const userOrdersKey = (userId: string) => `user-orders:${userId.replace(/[^a-zA-Z0-9-]/g, '')}`
