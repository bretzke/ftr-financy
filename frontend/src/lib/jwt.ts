interface JwtPayload {
  exp?: number
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  const payload = decodeToken(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 > Date.now()
}
