// Browser-only stand-in for the Nitro API, used by the static GitHub Pages build (NUXT_STATIC=true).
// It runs the same shared catalog/order logic as the server, against DummyJSON directly.
// Accounts, sessions and orders live in this browser's localStorage, so this is demo-grade:
// fine for showing the store off, not a replacement for the real server deployment.
import type { CategoryGroup, Order, Product, ProductDetailResponse, ProductListResponse, User } from '~~/types/types'
import { categoryGroups, fetchCatalog, listProducts, productDetail } from '~~/shared/catalog'
import { ORDER_ID_RE, buildOrder } from '~~/shared/orders'
import { EMAIL_RE, fail, requireEmail, requireString } from '~~/shared/validate'
import type { Api } from '~/composables/useApi'

const KEYS = {
  users: 'nuxtwear:users',
  session: 'nuxtwear:session',
  orders: 'nuxtwear:orders',
  newsletter: 'nuxtwear:newsletter',
} as const

interface LocalUser extends User {
  salt: string
  passwordHash: string
}

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
    fail(507, 'Browser storage is full or blocked')
  }
}

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

async function hashPassword(password: string, salt: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 100_000, hash: 'SHA-256' }, key, 256)
  return toHex(bits)
}

const publicUser = ({ salt, passwordHash, ...user }: LocalUser): User => user

let instance: Api | null = null

export function createStaticBackend(dummyjsonBase: string): Api {
  if (instance) return instance

  let catalogPromise: Promise<Product[]> | null = null
  const catalog = () =>
    (catalogPromise ??= fetchCatalog(dummyjsonBase).catch((err) => {
      catalogPromise = null // allow a retry after a network failure
      throw err
    }))

  const session = () => read<User | null>(KEYS.session, null)
  const startSession = (user: User) => {
    write(KEYS.session, user)
    return { user }
  }

  instance = {
    async products(query): Promise<ProductListResponse> {
      return listProducts(await catalog(), query)
    },

    async product(id): Promise<ProductDetailResponse> {
      return productDetail(await catalog(), Number(id))
    },

    async categories(): Promise<CategoryGroup[]> {
      return categoryGroups(await catalog())
    },

    async me() {
      return { user: session() }
    },

    async login(identifier, password) {
      const id = requireString(identifier, 'Email or username', { max: 254 })
      const pw = requireString(password, 'Password', { max: 200 })

      if (EMAIL_RE.test(id)) {
        const local = read<Record<string, LocalUser>>(KEYS.users, {})[id.toLowerCase()]
        if (local && (await hashPassword(pw, local.salt)) === local.passwordHash) return startSession(publicUser(local))
      }

      const res = await fetch(`${dummyjsonBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: id, password: pw, expiresInMins: 60 }),
      }).catch(() => null)
      if (!res?.ok) fail(401, 'Incorrect email/username or password')

      const remote = await res.json()
      return startSession({
        id: `dj-${remote.id}`,
        firstName: remote.firstName,
        lastName: remote.lastName,
        email: remote.email,
        username: remote.username,
        image: remote.image,
        provider: 'dummyjson',
      })
    },

    async register(data) {
      const firstName = requireString(data.firstName, 'First name', { max: 60 })
      const lastName = requireString(data.lastName, 'Last name', { max: 60 })
      const email = requireEmail(data.email)
      const password = requireString(data.password, 'Password', { min: 8, max: 200 })

      const users = read<Record<string, LocalUser>>(KEYS.users, {})
      if (users[email]) fail(409, 'An account with this email already exists')

      const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
      const user: LocalUser = {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        provider: 'local',
        salt,
        passwordHash: await hashPassword(password, salt),
      }
      write(KEYS.users, { ...users, [email]: user })
      return startSession(publicUser(user))
    },

    async logout() {
      localStorage.removeItem(KEYS.session)
    },

    async createOrder(body) {
      const order = buildOrder(await catalog(), body, session())
      write(KEYS.orders, [order, ...read<Order[]>(KEYS.orders, [])])
      return { order }
    },

    async orders() {
      const user = session()
      if (!user) fail(401, 'Please sign in to continue')
      return { orders: read<Order[]>(KEYS.orders, []).filter((o) => o.userId === user.id) }
    },

    async order(id) {
      const order = ORDER_ID_RE.test(id) ? read<Order[]>(KEYS.orders, []).find((o) => o.id === id) : undefined
      if (!order || (order.userId && order.userId !== session()?.id)) fail(404, 'Order not found')
      return { order }
    },

    async subscribe(email) {
      const value = requireEmail(email)
      write(KEYS.newsletter, [...new Set([...read<string[]>(KEYS.newsletter, []), value])])
    },
  }
  return instance
}
