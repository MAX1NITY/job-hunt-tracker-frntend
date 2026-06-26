import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ContactsPage from './pages/ContactsPage'
import LoginPage from './pages/LoginPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="app-loading" />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/contacts" replace /> : <LoginPage />} />
        <Route path="/contacts" element={user ? <ContactsPage /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to={user ? '/contacts' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
