// Resolve the session before the first render so pages and middleware know who is signed in.
// Server build: once during SSR (the state is then hydrated). Static build: in the browser, from localStorage.
export default defineNuxtPlugin(async () => {
  const { staticMode } = useRuntimeConfig().public
  if (import.meta.client && !staticMode) return

  const { user } = useAuth()
  const res = await useApi().me().catch(() => null)
  user.value = res?.user ?? null
})
