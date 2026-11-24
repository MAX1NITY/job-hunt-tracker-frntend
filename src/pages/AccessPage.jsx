import { useState } from 'react'
import './AccessPage.css'

export default function AccessPage({ onSubmit, notice }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div className="access-page">
      <form className="access-card" onSubmit={handleSubmit}>
        <h1 className="access-title">Job Hunt Tracker</h1>
        <p className="access-sub">Enter your access key to continue</p>
        {notice && <p className="access-notice" role="alert">{notice}</p>}
        <input
          className="access-input"
          type="password"
          autoComplete="current-password"
          placeholder="Access key"
          aria-label="Access key"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <button className="access-btn" type="submit" disabled={!value.trim()}>Unlock</button>
      </form>
    </div>
  )
}
