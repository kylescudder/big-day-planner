import { afterEach, expect, test } from 'bun:test'

import {
  clearPendingSignIn,
  emailCodeLifetime,
  readPendingSignIn,
  savePendingSignIn
} from '../src/lib/pending-sign-in'

// A tab-scoped store, as the browser's sessionStorage would be.
const store = new Map<string, string>()
Object.assign(globalThis, {
  window: {
    sessionStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    }
  }
})

afterEach(() => store.clear())

test('email-code progress keeps only the email and request time', () => {
  const sentAt = Date.now() - 1000
  savePendingSignIn({ email: 'bride@example.com', sentAt })
  const [stored] = [...store.values()]
  expect(JSON.parse(stored!)).toEqual({ email: 'bride@example.com', sentAt })
  expect(readPendingSignIn()).toEqual({ email: 'bride@example.com', sentAt })
  clearPendingSignIn()
  expect(readPendingSignIn()).toBeNull()
})

test('expired, future or malformed progress is discarded', () => {
  const now = Date.now()
  for (const value of [
    { email: 'bride@example.com', sentAt: now - emailCodeLifetime },
    { email: 'bride@example.com', sentAt: now + 60_000 },
    { email: 'not-an-email', sentAt: now },
    { email: 'bride@example.com' },
    'nonsense'
  ]) {
    store.set(
      'big-day-planner.pending-email-sign-in.v1',
      typeof value === 'string' ? value : JSON.stringify(value)
    )
    expect(readPendingSignIn(now)).toBeNull()
    expect(store.size).toBe(0)
  }
})
