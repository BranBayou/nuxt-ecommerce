import type { ProductListResponse } from '~~/types/types'

export default defineEventHandler(async (event): Promise<ProductListResponse> => {
  return listProducts(await getCatalog(), getQuery(event))
})
