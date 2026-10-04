import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const firstName = requireString(body?.firstName, 'First name', { max: 60 })
  const lastName = requireString(body?.lastName, 'Last name', { max: 60 })
  const email = requireEmail(body?.email)
  const password = requireString(body?.password, 'Password', { min: 8, max: 200 })

  const key = userKey(email)
  if (await useDb().hasItem(key)) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists' })
  }

  const stored: StoredUser = {
    id: randomUUID(),
    firstName,
    lastName,
    email,
    provider: 'local',
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  await useDb().setItem(key, stored)

  const { passwordHash, createdAt, ...user } = stored
  await createSession(event, user)
  setResponseStatus(event, 201)
  return { user }
})
