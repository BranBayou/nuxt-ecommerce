import type { User } from '~~/types/types'

// Resolve the session on the server render so pages and middleware know who is signed in
export default defineNuxtPlugin(async () => {
  if (import.meta.client) return
  const { user } = useAuth()
  const res = await useRequestFetch()<{ user: User | null }>('/api/auth/me').catch(() => null)
  user.value = res?.user ?? null
})
