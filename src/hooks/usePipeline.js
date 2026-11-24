import { useState, useEffect, useCallback } from 'react'
import { fetchContacts, fetchApplications } from '../utils/api'

const REJECTED = 'That access key was not accepted. Try again.'

// Both pages need both lists: contacts link to applications and back, and the
// sidebar counts each. ponytail: refetched per page, add a shared cache if it gets slow.
export function usePipeline(onLock) {
  const [contacts, setContacts] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchContacts(), fetchApplications()])
      .then(([c, a]) => { setContacts(c); setApplications(a) })
      .catch(err => {
        if (err.code === 'UNAUTHORIZED') onLock(REJECTED)
        else setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [onLock])

  useEffect(() => { load() }, [load])

  const failed = useCallback((showToast, action, err) => {
    if (err.code === 'UNAUTHORIZED') return onLock(REJECTED)
    showToast(`Failed to ${action}: ${err.message}`, 'error')
  }, [onLock])

  return { contacts, setContacts, applications, setApplications, loading, error, load, failed }
}
