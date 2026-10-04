export { ORDER_ID_RE, buildOrder } from '~~/shared/orders'

// Index of order ids per user; ids are filesystem-safe already
export const userOrdersKey = (userId: string) => `user-orders:${userId.replace(/[^a-zA-Z0-9-]/g, '')}`
