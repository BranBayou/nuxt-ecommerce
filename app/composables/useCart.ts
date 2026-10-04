import type { CartLine, ProductSummary } from '~~/types/types'

const MAX_PER_LINE = 10

export const useCart = () => {
  const items = useState<CartLine[]>('cart', () => [])
  const isOpen = useState('cart:open', () => false)

  const count = computed(() => items.value.reduce((n, i) => n + i.quantity, 0))
  const subtotal = computed(() => Math.round(items.value.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100)

  const find = (productId: number, size: string) =>
    items.value.find((i) => i.productId === productId && i.size === size)

  function add(product: ProductSummary, size: string, quantity = 1) {
    const max = Math.min(MAX_PER_LINE, product.stock)
    const existing = find(product.id, size)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, max)
    } else {
      items.value.push({
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        categoryLabel: product.categoryLabel,
        price: product.price,
        size,
        quantity: Math.min(quantity, max),
        stock: product.stock,
      })
    }
    isOpen.value = true
  }

  function setQuantity(productId: number, size: string, quantity: number) {
    const line = find(productId, size)
    if (!line) return
    if (quantity < 1) return remove(productId, size)
    line.quantity = Math.min(quantity, MAX_PER_LINE, line.stock)
  }

  function remove(productId: number, size: string) {
    items.value = items.value.filter((i) => !(i.productId === productId && i.size === size))
  }

  function clear() {
    items.value = []
  }

  return { items, isOpen, count, subtotal, add, setQuantity, remove, clear }
}
