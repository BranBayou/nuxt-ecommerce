import type { ProductSummary } from '~~/types/types'

export const useWishlist = () => {
  const items = useState<ProductSummary[]>('wishlist', () => [])

  const has = (id: number) => items.value.some((p) => p.id === id)

  function toggle(product: ProductSummary) {
    items.value = has(product.id)
      ? items.value.filter((p) => p.id !== product.id)
      : [product, ...items.value]
  }

  return { items, has, toggle }
}
