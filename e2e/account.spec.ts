import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
test('a signed-in profile remains available after reload', async ({ page }) => {
  await page.goto('/profile')
  await expect(
    page.getByRole('button', { name: 'Sign out', exact: true })
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Sign out', exact: true })
  ).toBeVisible()
})
test.describe('signed-out', () => {
  // Fixture-managed page with empty storage, so evidence recording applies.
  test.use({ storageState: { cookies: [], origins: [] } })

  test('a signed-out visitor must sign in to open their profile', async ({
    page
  }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/auth\/sign-in/)
    await expect(page.locator('#password')).toBeVisible()
  })

  test('a wrong password is rejected and the visitor stays signed out', async ({
    page
  }) => {
    await page.goto('/auth/sign-in?redirectTo=%2Fprofile')
    await page.locator('#email').fill(process.env.E2E_USERNAME!)
    await page.locator('#password').fill(`wrong-${randomUUID()}`)
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(
      page.getByText('Invalid email or password', { exact: true })
    ).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/auth\/sign-in/)
  })
})

test('a guest can be created and remains in the list after reload', async ({
  page
}, info) => {
  const surname = `${info.project.name} ${randomUUID()}`
  await page.goto('/guests')
  await page.getByRole('button', { name: 'Add Guest', exact: true }).click()
  await page.getByLabel('Forename', { exact: true }).fill('Browser')
  await page.getByLabel('Surname', { exact: true }).fill(surname)
  await page
    .getByLabel('Guest Key', { exact: true })
    .fill(randomUUID().replaceAll('-', '').slice(0, 20))
  await page.getByLabel('Guest Key', { exact: true }).press('Enter')
  await expect(
    page.getByText('Email is required', { exact: true })
  ).toBeVisible()
  await page
    .getByLabel('Email address', { exact: true })
    .fill(`guest-${surname.replaceAll(' ', '-')}@example.test`)
  await page.getByLabel('Phone number', { exact: true }).fill('07700900000')
  const saved = page.waitForResponse(
    (response) =>
      response.url().includes('guest.create') &&
      response.request().method() === 'POST'
  )
  await page.getByLabel('Phone number', { exact: true }).press('Enter')
  expect((await saved).ok()).toBe(true)
  await expect(
    page.getByRole('dialog', { name: 'Add Guest', exact: true })
  ).toBeHidden()
  await page.getByPlaceholder('Filter guests...').fill(surname)
  await expect(
    page.getByRole('cell', {
      name: `Browser ${surname}`,
      exact: true
    })
  ).toBeVisible()
  await page.reload()
  await page.getByPlaceholder('Filter guests...').fill(surname)
  await expect(
    page.getByRole('cell', {
      name: `Browser ${surname}`,
      exact: true
    })
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath('guests.png'), fullPage: true })
})
