import { getAccessKey, clearAccessKey } from './accessKey'

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

// Thrown when there is no access key or the backend rejects it, so the UI can
// send the user back to the key screen instead of showing a raw error.
export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.code = 'UNAUTHORIZED'
  }
}

async function request(path, options = {}) {
  const key = getAccessKey()
  if (!key) throw new UnauthorizedError('No access key')

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': key,
    },
    ...options,
  })

  if (res.status === 401) {
    clearAccessKey()
    throw new UnauthorizedError('Access key was not accepted')
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export function fetchContacts() {
  return request('/contacts')
}

export function createContact(data) {
  return request('/contacts', { method: 'POST', body: JSON.stringify(data) })
}

export function updateContact(id, data) {
  return request(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteContact(id) {
  return request(`/contacts/${id}`, { method: 'DELETE' })
}
