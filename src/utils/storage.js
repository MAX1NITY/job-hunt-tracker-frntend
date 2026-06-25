const KEY = 'job-hunt-contacts'

export function getContacts() {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveContacts(contacts) {
  localStorage.setItem(KEY, JSON.stringify(contacts))
}

export function addContact(contact) {
  const contacts = getContacts() || []
  const updated = [...contacts, contact]
  saveContacts(updated)
  return updated
}

export function updateContact(updated) {
  const contacts = getContacts() || []
  const next = contacts.map(c => c.id === updated.id ? updated : c)
  saveContacts(next)
  return next
}

export function deleteContact(id) {
  const contacts = getContacts() || []
  const next = contacts.filter(c => c.id !== id)
  saveContacts(next)
  return next
}
