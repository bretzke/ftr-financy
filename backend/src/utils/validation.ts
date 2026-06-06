export function assertNotEmpty(
  value: string | undefined | null,
  field: string
): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(`${field} is required`)
  }
  return trimmed
}

export function assertMinLength(
  value: string,
  min: number,
  field: string
): string {
  if (value.length < min) {
    throw new Error(`${field} must have at least ${min} characters`)
  }
  return value
}

export function assertEmail(email: string): string {
  const trimmed = assertNotEmpty(email, 'email')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email format')
  }
  return trimmed.toLowerCase()
}

export function assertPositiveAmount(
  amount: number | undefined | null,
  field = 'amount'
): number {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    throw new Error(`${field} is required`)
  }
  if (amount <= 0) {
    throw new Error(`${field} must be greater than zero`)
  }
  return amount
}

export function assertValidDate(
  date: Date | undefined | null,
  field = 'date'
): Date {
  if (!date) {
    throw new Error(`${field} is required`)
  }
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} is invalid`)
  }
  return parsed
}

export function assertAtLeastOneField(
  fields: Record<string, unknown>,
  message = 'At least one field must be provided'
): void {
  const hasValue = Object.values(fields).some(
    (value) => value !== undefined && value !== null
  )
  if (!hasValue) {
    throw new Error(message)
  }
}
