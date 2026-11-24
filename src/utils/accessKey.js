// The app is single-user, so instead of accounts there is one shared secret
// (the backend's APP_ACCESS_KEY). It is typed in once per device and kept in
// localStorage. Storage can throw (private mode, blocked cookies), so every
// access is wrapped.
const KEY = 'jht:access-key'

export function getAccessKey() {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

export function setAccessKey(value) {
  try {
    localStorage.setItem(KEY, value.trim())
  } catch {
    // ignore: the key just won't persist across reloads
  }
}

export function clearAccessKey() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
