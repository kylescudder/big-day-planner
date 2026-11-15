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
test('a signed-out visitor must sign in to open their profile', async ({
  browser
}) => {
  const context = await browser.newContext({
    storageState: { cookies: [], origins: [] }
  })
  try {
    const page = await context.newPage()
    await page.goto(process.env.E2E_BASE_URL + '/profile')
    await expect(page).toHaveURL(/\/auth\/sign-in/)
    await expect(page.locator('#password')).toBeVisible()
  } finally {
    await context.close()
  }
})

test('a guest can be created and remains in the list after reload', async ({
  page
}, info) => {
  await page.goto('/guests')
  await page.getByRole('button', { name: 'Add Guest', exact: true }).click()
  await page.getByLabel('Forename', { exact: true }).fill('Browser')
  await page.getByLabel('Surname', { exact: true }).fill(info.project.name)
  await page
    .getByLabel('Guest Key', { exact: true })
    .fill(`browser-${info.project.name}`)
  await page.getByLabel('Guest Key', { exact: true }).press('Enter')
  await expect(
    page.getByText('Email is required', { exact: true })
  ).toBeVisible()
  await page
    .getByLabel('Email address', { exact: true })
    .fill(`guest-${info.project.name}@example.test`)
  await page.getByLabel('Phone number', { exact: true }).fill('07700900000')
  await page.getByLabel('Phone number', { exact: true }).press('Enter')
  await expect(
    page.getByRole('cell', {
      name: `Browser ${info.project.name}`,
      exact: true
    })
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('cell', {
      name: `Browser ${info.project.name}`,
      exact: true
    })
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath('guests.png'), fullPage: true })
})
