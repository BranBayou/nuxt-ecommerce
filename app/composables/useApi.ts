import type {
  CategoryGroup, Order, OrderInput, ProductDetailResponse, ProductListResponse, User,
} from '~~/types/types'

export interface Api {
  products(query: Record<string, unknown>): Promise<ProductListResponse>
  product(id: number | string): Promise<ProductDetailResponse>
  categories(): Promise<CategoryGroup[]>
  me(): Promise<{ user: User | null }>
  login(identifier: string, password: string): Promise<{ user: User }>
  register(data: { firstName: string; lastName: string; email: string; password: string }): Promise<{ user: User }>
  logout(): Promise<void>
  createOrder(body: OrderInput): Promise<{ order: Order }>
  orders(): Promise<{ orders: Order[] }>
  order(id: string): Promise<{ order: Order }>
  subscribe(email: string): Promise<void>
}

/**
 * The app's single data layer. The normal build talks to the Nitro `/api` routes;
 * the static GitHub Pages build (NUXT_STATIC=true) swaps in a browser-only backend.
 * Call it during setup (like any composable), then use the returned methods anywhere.
 */
export function useApi(): Api {
  const config = useRuntimeConfig().public
  if (config.staticMode) return createStaticBackend(config.dummyjsonBase)

  // Forwards the session cookie during SSR; plain $fetch in the browser
  const request = useRequestFetch()

  return {
    products: (query) => request<ProductListResponse>('/api/products', { query }),
    product: (id) => request<ProductDetailResponse>(`/api/products/${id}`),
    categories: () => request<CategoryGroup[]>('/api/categories'),
    me: () => request<{ user: User | null }>('/api/auth/me'),
    login: (identifier, password) => request<{ user: User }>('/api/auth/login', { method: 'POST', body: { identifier, password } }),
    register: (data) => request<{ user: User }>('/api/auth/register', { method: 'POST', body: data }),
    logout: async () => {
      await request('/api/auth/logout', { method: 'POST' })
    },
    createOrder: (body) => request<{ order: Order }>('/api/orders', { method: 'POST', body }),
    orders: () => request<{ orders: Order[] }>('/api/orders'),
    order: (id) => request<{ order: Order }>(`/api/orders/${id}`),
    subscribe: async (email) => {
      await request('/api/newsletter', { method: 'POST', body: { email } })
    },
  }
}
