import type { ProductDetailResponse } from '~~/types/types'

export default defineEventHandler(async (event): Promise<ProductDetailResponse> => {
  return productDetail(await getCatalog(), Number(getRouterParam(event, 'id')))
})
