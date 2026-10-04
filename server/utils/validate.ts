// Tiny request-body helpers so the API doesn't need a schema library

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function badRequest(message: string): never {
  throw createError({ statusCode: 400, statusMessage: message })
}

export function requireString(value: unknown, field: string, { min = 1, max = 200 } = {}) {
  if (typeof value !== 'string') badRequest(`${field} is required`)
  const v = value.trim()
  if (v.length < min) badRequest(min > 1 ? `${field} must be at least ${min} characters` : `${field} is required`)
  if (v.length > max) badRequest(`${field} is too long`)
  return v
}

export function requireEmail(value: unknown, field = 'Email') {
  const v = requireString(value, field, { max: 254 }).toLowerCase()
  if (!EMAIL_RE.test(v)) badRequest(`${field} is not valid`)
  return v
}

export function requireOneOf<T extends string>(value: unknown, options: readonly T[], field: string): T {
  if (!options.includes(value as T)) badRequest(`${field} must be one of: ${options.join(', ')}`)
  return value as T
}
