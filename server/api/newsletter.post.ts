import { createHash } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = requireEmail(body?.email)
  const key = `newsletter:${createHash('sha256').update(email).digest('hex')}`
  await useDb().setItem(key, { email, subscribedAt: new Date().toISOString() })
  return { ok: true }
})
