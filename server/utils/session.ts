import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import type { H3Event } from 'h3'
import type { User } from '~~/types/types'

const scryptAsync = promisify(scrypt) as (pw: string, salt: string, len: number) => Promise<Buffer>

const COOKIE = 'nw_session'
const SESSION_TTL = 60 * 60 * 24 * 7 // 7 days, in seconds

export const useDb = () => useStorage('db')

export interface StoredUser extends User {
  passwordHash: string
  createdAt: string
}

interface Session {
  user: User
  expiresAt: number
}

// Storage keys become file paths, so emails are hashed rather than used raw
export const userKey = (email: string) =>
  `users:${createHash('sha256').update(email.trim().toLowerCase()).digest('hex')}`

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(password, salt, 64)
  return `${salt}:${key.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(':')
  if (!salt || !hex) return false
  const key = await scryptAsync(password, salt, 64)
  const expected = Buffer.from(hex, 'hex')
  return expected.length === key.length && timingSafeEqual(expected, key)
}

export async function createSession(event: H3Event, user: User) {
  const id = randomBytes(32).toString('hex')
  await useDb().setItem<Session>(`sessions:${id}`, { user, expiresAt: Date.now() + SESSION_TTL * 1000 })
  setCookie(event, COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: SESSION_TTL,
  })
}

export async function getSessionUser(event: H3Event): Promise<User | null> {
  const id = getCookie(event, COOKIE)
  if (!id || !/^[a-f0-9]{64}$/.test(id)) return null
  const session = await useDb().getItem<Session>(`sessions:${id}`)
  if (!session) return null
  if (session.expiresAt < Date.now()) {
    await useDb().removeItem(`sessions:${id}`)
    return null
  }
  return session.user
}

export async function requireUser(event: H3Event) {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Please sign in to continue' })
  return user
}

export async function destroySession(event: H3Event) {
  const id = getCookie(event, COOKIE)
  if (id && /^[a-f0-9]{64}$/.test(id)) await useDb().removeItem(`sessions:${id}`)
  deleteCookie(event, COOKIE, { path: '/' })
}
