import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// api.js reads the access key from localStorage (via accessKey.js) and sends
// it in the X-Access-Key header, so the key helpers are mocked here.
vi.mock('./accessKey', () => ({
  getAccessKey: vi.fn(),
  clearAccessKey: vi.fn(),
}))

const { getAccessKey, clearAccessKey } = await import('./accessKey')

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
  getAccessKey.mockReturnValue('secret-key')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.resetModules()
  vi.clearAllMocks()
})

describe('request base URL', () => {
  // Regression test for a real bug: VITE_API_URL with a trailing slash produced
  // requests like `${BASE}/contacts` -> "https://api.example.com//contacts".
  it('strips a trailing slash from VITE_API_URL before building request URLs', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/')
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
  it('throws instead of calling fetch when there is no access key', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    getAccessKey.mockReturnValue('')

    const { fetchContacts } = await import('./api')

    await expect(fetchContacts()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends the access key in the X-Access-Key header', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    getAccessKey.mockReturnValue('abc-key')
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] })

    const { fetchContacts } = await import('./api')
    await fetchContacts()

    const [, options] = fetch.mock.calls[0]
    expect(options.headers['X-Access-Key']).toBe('abc-key')
    expect(options.headers.Authorization).toBeUndefined()
  })

  it('clears the stored key and throws UNAUTHORIZED on a 401', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    fetch.mockResolvedValue({ ok: false, status: 401, text: async () => 'nope' })

    const { fetchContacts } = await import('./api')

    await expect(fetchContacts()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    expect(clearAccessKey).toHaveBeenCalledTimes(1)
  })

  it('rejects with the response body text when the request fails', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    fetch.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })

    const { fetchContacts } = await import('./api')

    await expect(fetchContacts()).rejects.toThrow('boom')
    expect(clearAccessKey).not.toHaveBeenCalled()
  })

  it('returns null for a 204 No Content response instead of parsing JSON', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    fetch.mockResolvedValue({ ok: true, status: 204 })

    const { deleteContact } = await import('./api')

    await expect(deleteContact('1')).resolves.toBeNull()
  })
})
