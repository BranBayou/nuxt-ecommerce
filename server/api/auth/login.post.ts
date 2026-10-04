import type { User } from '~~/types/types'

interface DummyAuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const identifier = requireString(body?.identifier, 'Email or username', { max: 254 })
  const password = requireString(body?.password, 'Password', { max: 200 })

  // 1. Accounts registered in this store
  if (EMAIL_RE.test(identifier)) {
    const stored = await useDb().getItem<StoredUser>(userKey(identifier))
    if (stored && (await verifyPassword(password, stored.passwordHash))) {
      const { passwordHash, createdAt, ...user } = stored
      await createSession(event, user)
      return { user }
    }
  }

  // 2. DummyJSON demo accounts (see https://dummyjson.com/users)
  const { dummyjsonBase } = useRuntimeConfig().public
  const remote = await $fetch<DummyAuthResponse>(`${dummyjsonBase}/auth/login`, {
    method: 'POST',
    body: { username: identifier, password, expiresInMins: 60 },
  }).catch(() => null)

  if (!remote) throw createError({ statusCode: 401, statusMessage: 'Incorrect email/username or password' })

  const user: User = {
    id: `dj-${remote.id}`,
    firstName: remote.firstName,
    lastName: remote.lastName,
    email: remote.email,
    username: remote.username,
    image: remote.image,
    provider: 'dummyjson',
  }
  await createSession(event, user)
  return { user }
})
