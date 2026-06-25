import { useState } from 'react'
import './ContactForm.css'

const STATUSES = ['Not Contacted', 'Messaged', 'Replied', 'Interview', 'Closed']

const EMPTY = {
  name: '',
  role: '',
  company: '',
  linkedinUrl: '',
  status: 'Not Contacted',
  followUpDate: '',
  notes: '',
}

export default function ContactForm({ contact, onSave, onClose, saving = false }) {
  const [form, setForm] = useState(
    contact ? { ...contact, followUpDate: contact.followUpDate ?? '' } : EMPTY
  )

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.company.trim()) return
    onSave({ ...form, followUpDate: form.followUpDate || null })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{contact ? 'Edit Contact' : 'Add Contact'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">
              Name *
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </label>
            <label className="form-label">
              Role
              <input
                className="form-input"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Engineering Manager"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Company *
              <input
                className="form-input"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </label>
            <label className="form-label">
              Status
              <select className="form-input" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label className="form-label">
            LinkedIn URL
            <input
              className="form-input"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </label>

          <label className="form-label">
            Follow-up Date
            <input
              className="form-input"
              type="date"
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
            />
          </label>

          <label className="form-label">
            Notes
            <textarea
              className="form-input form-textarea"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any notes..."
              rows={3}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : contact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
