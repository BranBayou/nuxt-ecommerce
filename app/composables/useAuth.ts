import type { User } from '~~/types/types'

export const useAuth = () => {
  const api = useApi()
  const user = useState<User | null>('auth:user', () => null)
  const loggedIn = computed(() => user.value !== null)

  async function login(identifier: string, password: string) {
    user.value = (await api.login(identifier, password)).user
  }

  async function register(data: { firstName: string; lastName: string; email: string; password: string }) {
    user.value = (await api.register(data)).user
  }

  async function logout() {
    await api.logout()
    user.value = null
    await navigateTo('/')
  }

  return { user, loggedIn, login, register, logout }
}

// h3 errors arrive as FetchError with the message in data.statusMessage (the static backend matches that shape)
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  const e = err as { data?: { statusMessage?: string; message?: string }; statusMessage?: string }
  return e?.data?.statusMessage || e?.data?.message || e?.statusMessage || fallback
}
