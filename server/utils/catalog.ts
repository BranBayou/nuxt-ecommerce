import type { Product } from '~~/types/types'
import { fetchCatalog } from '~~/shared/catalog'

export { categoryGroups, listProducts, productDetail, toSummary } from '~~/shared/catalog'

export const getCatalog = defineCachedFunction(
  (): Promise<Product[]> => fetchCatalog(useRuntimeConfig().public.dummyjsonBase),
  { name: 'catalog', getKey: () => 'v1', maxAge: 60 * 60, swr: true },
)
