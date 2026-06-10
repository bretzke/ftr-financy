import { GraphQLClient } from 'graphql-request'
import { env } from './env'
import { tokenStorage } from './storage'

function headersToRecord(
  headers: HeadersInit | undefined
): Record<string, string> {
  if (!headers) return {}
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries())
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }
  return { ...headers }
}

export const graphqlClient = new GraphQLClient(env.backendUrl, {
  requestMiddleware: (request) => {
    const token = tokenStorage.get()
    return {
      ...request,
      headers: {
        ...headersToRecord(request.headers as HeadersInit | undefined),
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }
  },
})
