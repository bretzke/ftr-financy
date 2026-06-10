import { ClientError } from 'graphql-request'

export function getErrorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.'
): string {
  if (error instanceof ClientError) {
    const gqlMessage = error.response.errors?.[0]?.message
    if (gqlMessage) return gqlMessage
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}
