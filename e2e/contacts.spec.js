import { test, expect } from '@playwright/test'

// supabase-js's default storage key is `sb-${hostname-first-label}-auth-token`,
// derived from VITE_SUPABASE_URL (see playwright.config.js) -- so for
// "https://test-project.supabase.co" that's "sb-test-project-auth-token".
const STORAGE_KEY = 'sb-test-project-auth-token'

const FAKE_SESSION = {
  access_token: 'fake-access-token',
  refresh_token: 'fake-refresh-token',
  // Far enough out that supabase-js's __loadSession() treats it as unexpired
  // and returns it straight from localStorage, with no network call.
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  },
}

async function signInAsTestUser(page) {
  // Runs before any app script, so useAuth()'s getSession() call on mount
  // already finds a session -- no real Google OAuth round-trip needed.
  await page.addInitScript(
    ({ key, session }) => window.localStorage.setItem(key, JSON.stringify(session)),
    { key: STORAGE_KEY, session: FAKE_SESSION }
  )
}

test('redirects an unauthenticated visitor to the login page', async ({ page }) => {
  await page.goto('/contacts')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible()
})

test('logs in, adds a contact, and sees it appear in the list', async ({ page }) => {
  await signInAsTestUser(page)

  // Stub the FastAPI backend -- this test exercises the frontend's own
  // logic (routing guard, form, optimistic list update), not the real API.
  // Scoped to the API origin specifically: a loose "**/contacts" glob also
  // matches the SPA's own http://localhost:5173/contacts page navigation
  // and would hijack it with a JSON body instead of the app's HTML shell.
  let contacts = []
  await page.route('http://localhost:8000/contacts', async (route) => {
    const req = route.request()
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
