import type { User } from '@/graphql/types'

const TOKEN_KEY = '@financy:token'
const REFRESH_TOKEN_KEY = '@financy:refreshToken'
const USER_KEY = '@financy:user'

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  set(token: string, refreshToken: string) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

export const userStorage = {
  get(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },
  set(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(USER_KEY)
  },
}
