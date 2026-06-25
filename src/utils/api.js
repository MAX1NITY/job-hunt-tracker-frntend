const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
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
