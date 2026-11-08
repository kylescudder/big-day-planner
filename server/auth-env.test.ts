import { expect, test } from 'bun:test'

import { readAuthEnv } from '../src/server/auth-env'

const betterAuth = {
  AUTH_PROVIDER: 'better-auth',
  BETTER_AUTH_URL: 'https://rsvp.example.com/',
  BETTER_AUTH_SECRET: 'x'.repeat(32),
  BREVO_API_KEY: 'brevo-fixture',
  AUTH_EMAIL_FROM: 'rsvp@example.com',
  AUTH_ALLOWED_EMAILS: ' Groom@Example.com, bride@example.com ,'
}

test('Clerk stays the default and needs no Better Auth settings', () => {
  const env = readAuthEnv({})
  expect(env.AUTH_PROVIDER).toBe('clerk')
  expect(env.AUTH_ALLOWED_EMAILS).toEqual([])
  expect(env.AUTH_EMAIL_DAILY_LIMIT).toBe(40)
})

test('Better Auth settings are normalised', () => {
  const env = readAuthEnv(betterAuth)
  expect(env.BETTER_AUTH_URL).toBe('https://rsvp.example.com')
  expect(env.AUTH_ALLOWED_EMAILS).toEqual([
    'groom@example.com',
    'bride@example.com'
  ])
  expect(readAuthEnv({ ...betterAuth, AUTH_EMAIL_DAILY_LIMIT: '12' })).toEqual(
    expect.objectContaining({ AUTH_EMAIL_DAILY_LIMIT: 12 })
  )
})

test('Better Auth refuses missing or unsafe settings by name only', () => {
  for (const key of [
    'BETTER_AUTH_URL',
    'BETTER_AUTH_SECRET',
    'BREVO_API_KEY',
    'AUTH_EMAIL_FROM',
    'AUTH_ALLOWED_EMAILS'
  ])
    expect(() => readAuthEnv({ ...betterAuth, [key]: '' })).toThrow(key)
  expect(() =>
    readAuthEnv({ ...betterAuth, AUTH_ALLOWED_EMAILS: 'not-an-email' })
  ).toThrow('AUTH_ALLOWED_EMAILS')
  expect(() =>
    readAuthEnv({
      ...betterAuth,
      NODE_ENV: 'production',
      BETTER_AUTH_URL: 'http://rsvp.example.com'
    })
  ).toThrow('BETTER_AUTH_URL')
  for (const BETTER_AUTH_URL of [
    'https://rsvp.example.com/path',
    'https://user:pw@rsvp.example.com'
  ])
    expect(() => readAuthEnv({ ...betterAuth, BETTER_AUTH_URL })).toThrow(
      'BETTER_AUTH_URL'
    )
  const secret = 'short-secret-do-not-print'
  try {
    readAuthEnv({ ...betterAuth, BETTER_AUTH_SECRET: secret })
    throw new Error('invalid configuration was accepted')
  } catch (error) {
    expect((error as Error).message).toContain('BETTER_AUTH_SECRET')
    expect((error as Error).message).not.toContain(secret)
  }
})
