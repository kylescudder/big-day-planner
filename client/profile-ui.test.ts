import { afterEach, expect, test } from 'bun:test'

import { profileAvatar } from '../src/lib/profile-ui'

const originalFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = originalFetch
})

function mockFetch(response: () => Response) {
  const calls: { url: string; init?: RequestInit }[] = []
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init })
    return response()
  }) as typeof fetch
  return calls
}

test('the profile photo is enabled and uploads to the private endpoint, not UploadThing', async () => {
  expect(profileAvatar.enabled).toBe(true)
  const calls = mockFetch(() =>
    Response.json({ image: '/api/profile/avatar?v=next' })
  )
  const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'avatar.jpg', {
    type: 'image/jpeg'
  })
  expect(await profileAvatar.upload(file)).toBe('/api/profile/avatar?v=next')
  expect(calls).toHaveLength(1)
  expect(calls[0]!.url).toBe('/api/profile/avatar')
  expect(calls[0]!.init?.method).toBe('PUT')
  expect(calls[0]!.init?.body).toBe(file)
  expect(new Headers(calls[0]!.init?.headers).get('Content-Type')).toBe(
    'image/jpeg'
  )
})

test('removing the photo calls DELETE, and server errors are shown', async () => {
  const calls = mockFetch(() => Response.json({ image: null }))
  await profileAvatar.delete()
  expect(calls[0]).toMatchObject({
    url: '/api/profile/avatar',
    init: { method: 'DELETE' }
  })

  mockFetch(() =>
    Response.json({ error: 'This upload is too large.' }, { status: 413 })
  )
  await expect(
    profileAvatar.upload(new File(['x'], 'a.jpg', { type: 'image/jpeg' }))
  ).rejects.toThrow('This upload is too large.')
})

test('only JPEG, PNG or WebP photos up to 10 MB are prepared', async () => {
  await expect(
    profileAvatar.resize(
      new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })
    )
  ).rejects.toThrow('Choose a JPEG, PNG or WebP photo.')
  await expect(
    profileAvatar.resize(
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'big.png', {
        type: 'image/png'
      })
    )
  ).rejects.toThrow('Choose a photo smaller than 10 MB.')
})
