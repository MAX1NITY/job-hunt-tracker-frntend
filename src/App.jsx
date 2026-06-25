import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ContactsPage from './pages/ContactsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/contacts" replace />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
