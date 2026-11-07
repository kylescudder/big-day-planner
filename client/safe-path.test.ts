import { expect, test } from 'bun:test'

import { plannerHome, safeAppPath } from '../src/lib/auth/safe-path'

test('sign-in redirects stay on this site', () => {
  expect(plannerHome).toBe('/guests')
  expect(safeAppPath('/profile')).toBe('/profile')
  expect(safeAppPath('/guests?tab=menu#top')).toBe('/guests?tab=menu#top')
  for (const target of [
    'https://attacker.example/',
    '//attacker.example/',
    '/.//attacker.example/',
    '/./../attacker.example/..//attacker.example/',
    '/%2e//attacker.example/',
    '/\t/attacker.example/',
    '/\n/attacker.example/',
    '/\\attacker.example/',
    'javascript:alert(1)',
    ''
  ])
    expect(safeAppPath(target)).toBe(plannerHome)
})
