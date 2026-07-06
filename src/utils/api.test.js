import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// api.js reads the session from supabase to attach the Authorization header,
// so the client is mocked rather than hit for real.
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}))

const { supabase } = await import('../lib/supabase')

function mockSession(accessToken = 'token-123') {
  supabase.auth.getSession.mockResolvedValue({
    data: { session: accessToken ? { access_token: accessToken } : null },
  })
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('request base URL', () => {
  // Regression test for a real bug: VITE_API_URL with a trailing slash produced
  // requests like `${BASE}/contacts` -> "https://api.example.com//contacts".
  it('strips a trailing slash from VITE_API_URL before building request URLs', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/')
    mockSession()
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] })

    const { fetchContacts } = await import('./api')
    await fetchContacts()

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/contacts',
      expect.anything()
    )
  })
})

describe('request', () => {
  it('throws instead of calling fetch when there is no session', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    mockSession(null)

    const { fetchContacts } = await import('./api')

    await expect(fetchContacts()).rejects.toThrow('Not authenticated')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('attaches the access token as a Bearer header', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    mockSession('abc-token')
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] })

    const { fetchContacts } = await import('./api')
    await fetchContacts()

    const [, options] = fetch.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer abc-token')
  })

  it('rejects with the response body text when the request fails', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    mockSession()
    fetch.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })

    const { fetchContacts } = await import('./api')

    await expect(fetchContacts()).rejects.toThrow('boom')
  })

  it('returns null for a 204 No Content response instead of parsing JSON', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    mockSession()
    fetch.mockResolvedValue({ ok: true, status: 204 })

    const { deleteContact } = await import('./api')

    await expect(deleteContact('1')).resolves.toBeNull()
  })
})
