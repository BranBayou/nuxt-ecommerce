// Tiny request-body helpers shared by the Nitro API and the static (GitHub Pages) backend.
// Errors carry statusCode/statusMessage so h3 turns them into proper HTTP errors on the server,
// and `data.statusMessage` so the UI reads them the same way as a FetchError in the browser.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class ApiError extends Error {
  statusCode: number
  statusMessage: string
  data: { statusMessage: string }

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.statusMessage = message
    this.data = { statusMessage: message }
  }
}

export function fail(statusCode: number, message: string): never {
  throw new ApiError(statusCode, message)
}

export function badRequest(message: string): never {
  fail(400, message)
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
