import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getAccessKey, setAccessKey, clearAccessKey } from './utils/accessKey'
import ContactsPage from './pages/ContactsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import AccessPage from './pages/AccessPage'

function App() {
  const [unlocked, setUnlocked] = useState(() => !!getAccessKey())
  const [notice, setNotice] = useState('')

  function unlock(key) {
    setAccessKey(key)
    setNotice('')
    setUnlocked(true)
  }

  const lock = useCallback((reason = '') => {
    clearAccessKey()
    setNotice(reason)
    setUnlocked(false)
  }, [])

  if (!unlocked) return <AccessPage onSubmit={unlock} notice={notice} />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/contacts" element={<ContactsPage onLock={lock} />} />
        <Route path="/applications" element={<ApplicationsPage onLock={lock} />} />
        <Route path="*" element={<Navigate to="/contacts" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
