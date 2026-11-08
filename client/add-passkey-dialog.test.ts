import { afterAll, beforeAll, expect, test } from 'bun:test'
import { Window } from 'happy-dom'
import { act, createElement } from 'react'
import type { Root } from 'react-dom/client'

// Own DOM and globals, restored afterwards so other client tests are unaffected.
const browser = new Window({ url: 'https://bdp.auth.test/profile' })
const originalGlobals = new Map<string, PropertyDescriptor | undefined>()
const originalFetch = globalThis.fetch
let registerOptionsRequests = 0
let signOuts = 0
let root: Root | undefined

beforeAll(() => {
  const globals = {
    window: browser,
    document: browser.document,
    navigator: browser.navigator,
    HTMLElement: browser.HTMLElement,
    HTMLInputElement: browser.HTMLInputElement,
    Node: browser.Node,
    Element: browser.Element,
    Event: browser.Event,
    InputEvent: browser.InputEvent,
    // Radix dialogs dispatch these when they open and trap focus.
    CustomEvent: browser.CustomEvent,
    FocusEvent: browser.FocusEvent,
    KeyboardEvent: browser.KeyboardEvent,
    HTMLButtonElement: browser.HTMLButtonElement,
    HTMLDivElement: browser.HTMLDivElement,
    MutationObserver: browser.MutationObserver,
    ResizeObserver: browser.ResizeObserver,
    getComputedStyle: browser.getComputedStyle.bind(browser),
    requestAnimationFrame: browser.requestAnimationFrame.bind(browser),
    cancelAnimationFrame: browser.cancelAnimationFrame.bind(browser),
    IS_REACT_ACT_ENVIRONMENT: true
  }
  for (const [key, value] of Object.entries(globals)) {
    originalGlobals.set(key, Object.getOwnPropertyDescriptor(globalThis, key))
    Object.defineProperty(globalThis, key, { configurable: true, value })
  }
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url,
      browser.location.origin
    )
    if (url.pathname === '/api/auth/passkey/generate-register-options') {
      registerOptionsRequests++
      // What production returned: the session is older than freshAge (1 h).
      return Response.json(
        { message: 'Session is not fresh', code: 'SESSION_NOT_FRESH' },
        { status: 403, statusText: 'Forbidden' }
      )
    }
    if (url.pathname === '/api/auth/sign-out') {
      signOuts++
      return Response.json({ success: true })
    }
    if (url.pathname === '/api/auth/get-session')
      return Response.json({
        user: {
          id: 'user-1',
          name: 'Planner',
          email: 'planner@example.com',
          emailVerified: true,
          image: null,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z'
        },
        session: {
          id: 'session-1',
          userId: 'user-1',
          expiresAt: '2030-01-01T00:00:00Z',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z'
        }
      })
    if (url.pathname === '/api/auth/passkey/list-user-passkeys')
      return Response.json([])
    throw new Error('Unexpected test request: ' + url.pathname)
  }) as unknown as typeof fetch
})

afterAll(() => {
  globalThis.fetch = originalFetch
  for (const [key, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor)
    else delete (globalThis as Record<string, unknown>)[key]
  }
})

test('adding a passkey with a stale session offers "Sign in again" and returns to the profile', async () => {
  const { createRoot } = await import('react-dom/client')
  const { QueryClient } = await import('@tanstack/react-query')
  const { AuthProvider } = await import('../src/components/auth/auth-provider')
  const { AddPasskeyDialog } =
    await import('../src/components/auth/passkey/add-passkey-dialog')
  const { authClient } = await import('../src/lib/auth-client')
  const { passkeyPlugin } = await import('../src/lib/auth/passkey-plugin')

  const navigations: string[] = []
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  const container = browser.document.createElement('div')
  browser.document.body.appendChild(container)
  root = createRoot(container as unknown as HTMLElement)
  await act(async () => {
    root!.render(
      createElement(
        AuthProvider,
        {
          authClient,
          queryClient,
          navigate: ({ to }: { to: string }) => {
            navigations.push(to)
          },
          emailAndPassword: { enabled: false },
          plugins: [passkeyPlugin()]
        } as never,
        createElement(AddPasskeyDialog, { open: true, onOpenChange: () => {} })
      )
    )
    await new Promise((resolve) => setTimeout(resolve, 30))
  })
  try {
    // The dialog renders in a portal on document.body.
    const dialog = () =>
      browser.document.querySelector('[role="dialog"]') as unknown as Element
    expect(dialog()).toBeTruthy()
    const name = dialog().querySelector(
      'input[name="name"]'
    ) as HTMLInputElement
    await act(async () => {
      Object.getOwnPropertyDescriptor(
        browser.HTMLInputElement.prototype,
        'value'
      )!.set!.call(name, '1Password')
      name.dispatchEvent(new browser.Event('input', { bubbles: true }) as never)
    })
    await act(async () => {
      dialog()
        .querySelector('form')!
        .dispatchEvent(
          new browser.Event('submit', {
            bubbles: true,
            cancelable: true
          }) as never
        )
      await new Promise((resolve) => setTimeout(resolve, 30))
    })
    expect(registerOptionsRequests).toBe(1)
    // Before the fix the 403 resolved as { error }, so the form stayed put
    // with no message and no way forward.
    expect(dialog().querySelector('input[name="name"]')).toBeNull()
    const signInAgain = Array.from(dialog().querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Sign in again'
    )
    expect(signInAgain).toBeTruthy()
    await act(async () => {
      signInAgain!.click()
      await new Promise((resolve) => setTimeout(resolve, 30))
    })
    expect(signOuts).toBe(1)
    expect(navigations).toEqual([
      '/auth/sign-in?reauthenticate=true&redirectTo=%2Fprofile'
    ])
  } finally {
    await act(async () => root!.unmount())
  }
})
