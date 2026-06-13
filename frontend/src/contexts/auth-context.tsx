import * as React from 'react'
import { api } from '@/graphql/operations'
import { tokenStorage, userStorage } from '@/lib/storage'
import { queryClient } from '@/lib/query-client'
import type { LoginInput, RegisterInput, User } from '@/graphql/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (data: LoginInput) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  updateProfile: (name: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    const token = tokenStorage.get()
    return token ? userStorage.get() : null
  })

  const persistSession = React.useCallback(
    (payload: { token: string; refreshToken: string; user: User }) => {
      tokenStorage.set(payload.token, payload.refreshToken)
      userStorage.set(payload.user)
      setUser(payload.user)
    },
    []
  )

  const login = React.useCallback(
    async (data: LoginInput) => {
      const payload = await api.login(data)
      persistSession(payload)
    },
    [persistSession]
  )

  const register = React.useCallback(
    async (data: RegisterInput) => {
      const payload = await api.register(data)
      persistSession(payload)
    },
    [persistSession]
  )

  const updateProfile = React.useCallback(async (name: string) => {
    const updatedUser = await api.updateProfile({ name })
    userStorage.set(updatedUser)
    setUser(updatedUser)
  }, [])

  const logout = React.useCallback(() => {
    tokenStorage.clear()
    userStorage.clear()
    setUser(null)
    queryClient.clear()
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, login, register, updateProfile, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
