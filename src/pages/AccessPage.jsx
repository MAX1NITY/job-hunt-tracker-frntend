import { useState } from 'react'
import Icon from '../components/Icon'
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
        <span className="access-logo" aria-hidden="true">J</span>
        <h1 className="access-title">Job Hunt Tracker</h1>
        <p className="access-sub">Enter your access key to open your pipeline. You only need to do this once on each device.</p>
        {notice && <p className="access-notice" role="alert">{notice}</p>}
        <label className="access-field">
          <Icon name="lock" size={15} />
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
        </label>
        <button className="btn-primary access-btn" type="submit" disabled={!value.trim()}>Unlock</button>
      </form>
    </div>
  )
}
