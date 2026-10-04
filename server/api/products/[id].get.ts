import type { ProductDetailResponse } from '~~/types/types'

export default defineEventHandler(async (event): Promise<ProductDetailResponse> => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid product id' })

  const product = await findProduct(id)
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found' })

  // Same category first, then the rest of the same gender
  const catalog = await getCatalog()
  const related = [
    ...catalog.filter((p) => p.id !== id && p.category === product.category),
    ...catalog.filter((p) => p.id !== id && p.category !== product.category && p.gender === product.gender),
  ].slice(0, 8)

  return { product, related: related.map(toSummary) }
})
