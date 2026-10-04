import type { User } from '~~/types/types'

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const loggedIn = computed(() => user.value !== null)

  async function login(identifier: string, password: string) {
    const res = await $fetch<{ user: User }>('/api/auth/login', { method: 'POST', body: { identifier, password } })
    user.value = res.user
  }

  async function register(data: { firstName: string; lastName: string; email: string; password: string }) {
    const res = await $fetch<{ user: User }>('/api/auth/register', { method: 'POST', body: data })
    user.value = res.user
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  return { user, loggedIn, login, register, logout }
}

// h3 errors arrive as FetchError with the message in data.statusMessage
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  const e = err as { data?: { statusMessage?: string; message?: string }; statusMessage?: string }
  return e?.data?.statusMessage || e?.data?.message || e?.statusMessage || fallback
}
