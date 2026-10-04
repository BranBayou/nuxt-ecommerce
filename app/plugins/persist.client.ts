// Cart and wishlist live in localStorage. They are restored after hydration
// so the server-rendered markup (empty bag) never mismatches the client.
const KEYS = { cart: 'nuxtwear:cart', wishlist: 'nuxtwear:wishlist' } as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or blocked — the session still works in memory
  }
}

export default defineNuxtPlugin(() => {
  const cart = useCart()
  const wishlist = useWishlist()

  onNuxtReady(() => {
    cart.items.value = read(KEYS.cart, [])
    wishlist.items.value = read(KEYS.wishlist, [])

    watch(cart.items, (v) => write(KEYS.cart, v), { deep: true })
    watch(wishlist.items, (v) => write(KEYS.wishlist, v), { deep: true })

    // keep several open tabs in sync
    window.addEventListener('storage', (e) => {
      if (e.key === KEYS.cart) cart.items.value = read(KEYS.cart, [])
      if (e.key === KEYS.wishlist) wishlist.items.value = read(KEYS.wishlist, [])
    })
  })
})
