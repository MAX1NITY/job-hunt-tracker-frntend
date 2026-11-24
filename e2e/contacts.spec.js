import { test, expect } from '@playwright/test'

// The app has no accounts: one shared access key is typed in once per device
// and kept in localStorage under this key (see src/utils/accessKey.js).
const STORAGE_KEY = 'jht:access-key'

async function unlock(page, key = 'test-key') {
  // Runs before any app script, so the app starts already unlocked.
  await page.addInitScript(
    ({ k, v }) => window.localStorage.setItem(k, v),
    { k: STORAGE_KEY, v: key }
  )
  // Every page loads applications too; default to none unless a test overrides it.
  await page.route('http://localhost:8000/applications', route => route.fulfill({ json: [] }))
}

test('shows the access key screen when no key is stored', async ({ page }) => {
  await page.goto('/contacts')
  await expect(page.getByLabel('Access key')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Unlock' })).toBeDisabled()
})

test('a rejected key sends the user back to the key screen', async ({ page }) => {
  await unlock(page, 'wrong-key')
  await page.route('http://localhost:8000/contacts', route =>
    route.fulfill({ status: 401, json: { detail: 'Invalid or missing access key' } })
  )

  await page.goto('/contacts')

  await expect(page.getByRole('alert')).toContainText('not accepted')
  await expect(page.getByLabel('Access key')).toBeVisible()
})

test('unlocks, adds a contact, and sees it appear in the list', async ({ page }) => {
  await unlock(page)

  // Stub the FastAPI backend -- this test exercises the frontend's own
  // logic (key header, form, optimistic list update), not the real API.
  // Scoped to the API origin specifically: a loose "**/contacts" glob also
  // matches the SPA's own http://localhost:5173/contacts page navigation
  // and would hijack it with a JSON body instead of the app's HTML shell.
  let contacts = []
  let sentKey = null
  await page.route('http://localhost:8000/contacts', async (route) => {
    const req = route.request()
    sentKey = req.headers()['x-access-key']
    if (req.method() === 'GET') {
      return route.fulfill({ json: contacts })
    }
    if (req.method() === 'POST') {
      const created = {
        id: 'new-contact-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...req.postDataJSON(),
      }
      contacts = [created, ...contacts]
      return route.fulfill({ status: 201, json: created })
    }
    return route.continue()
  })

  await page.goto('/contacts')
  await expect(page).toHaveURL(/\/contacts$/)
  await expect(page.getByText('No contacts yet')).toBeVisible()
  expect(sentKey).toBe('test-key')

  // Both the header and the empty-state CTA render a "+ Add Contact" button.
  await page.getByRole('button', { name: '+ Add Contact' }).first().click()

  const modal = page.locator('.modal')
  await modal.getByPlaceholder('Full name').fill('Ada Lovelace')
  await modal.getByPlaceholder('Company name').fill('Analytical Engines Inc')
  await modal.getByRole('button', { name: 'Add Contact' }).click()

  await expect(page.getByText('Contact added')).toBeVisible()
  await expect(page.getByText('Ada Lovelace')).toBeVisible()
  await expect(page.getByText('Analytical Engines Inc')).toBeVisible()
})

test('Lock forgets the key and shows the key screen', async ({ page }) => {
  await unlock(page)
  await page.route('http://localhost:8000/contacts', route => route.fulfill({ json: [] }))

  await page.goto('/contacts')
  await page.getByRole('button', { name: 'Lock' }).click()

  await expect(page.getByLabel('Access key')).toBeVisible()
  expect(await page.evaluate(k => localStorage.getItem(k), STORAGE_KEY)).toBeNull()
})

test('adds an application and a new person in one go', async ({ page }) => {
  await unlock(page)

  let contacts = []
  let applications = []
  const stamp = () => ({ id: `id-${Math.random()}`, createdAt: '', updatedAt: '' })
  await page.route('http://localhost:8000/contacts', async (route) => {
    const req = route.request()
    if (req.method() === 'GET') return route.fulfill({ json: contacts })
    const created = { ...stamp(), status: 'Not Contacted', ...req.postDataJSON() }
    contacts = [created, ...contacts]
    return route.fulfill({ status: 201, json: created })
  })
  await page.route('http://localhost:8000/applications', async (route) => {
    const req = route.request()
    if (req.method() === 'GET') return route.fulfill({ json: applications })
    const created = { ...stamp(), ...req.postDataJSON() }
    applications = [created, ...applications]
    return route.fulfill({ status: 201, json: created })
  })

  await page.goto('/applications')
  await expect(page.getByText('No applications yet')).toBeVisible()
  await page.getByRole('button', { name: '+ Add Application' }).first().click()

  const modal = page.locator('.modal')
  await modal.getByPlaceholder('Company name').fill('Canva')
  await modal.getByPlaceholder('e.g. Junior Frontend Engineer').fill('Frontend Engineer')
  await modal.getByLabel('Contact').selectOption({ label: '+ Add a new person…' })
  await modal.getByPlaceholder('Full name').fill('Grace Hopper')
  await modal.getByRole('button', { name: 'Add Application' }).click()

  await expect(page.getByText('Grace Hopper saved to Contacts')).toBeVisible()
  expect(contacts[0]).toMatchObject({ name: 'Grace Hopper', company: 'Canva' })
  expect(applications[0].contactId).toBe(contacts[0].id)

  // The application's panel links back to the person.
  await page.getByRole('button', { name: 'Frontend Engineer' }).click()
  await expect(page.getByRole('link', { name: 'Grace Hopper' })).toBeVisible()
})
