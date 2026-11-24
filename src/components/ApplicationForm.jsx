import { useState } from 'react'
import Icon from './Icon'
import { APP_STATUSES, SOURCES, WORK_MODES } from '../utils/statuses'
// ponytail: same modal as the contact form, so it shares its styles.
import './ContactForm.css'

const NEW_PERSON = '__new'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// onSave(application, newPerson) -- newPerson is { name, role, linkedinUrl }
// when the user typed in someone who is not in Contacts yet, otherwise null.
export default function ApplicationForm({ application, contacts, onSave, onClose, saving = false }) {
  const [form, setForm] = useState(() => {
    const a = application ?? { company: '', role: '', status: 'Applied', appliedDate: today() }
    return {
      company: a.company, role: a.role, status: a.status,
      jobUrl: a.jobUrl ?? '', appliedDate: a.appliedDate ?? '', source: a.source ?? '',
      workMode: a.workMode ?? '', contactId: a.contactId ?? '', nextStep: a.nextStep ?? '',
      nextStepDate: a.nextStepDate ?? '', jobDescription: a.jobDescription ?? '', notes: a.notes ?? '',
    }
  })
  const [person, setPerson] = useState({ name: '', role: '', linkedinUrl: '' })
  const addingPerson = form.contactId === NEW_PERSON

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePerson(e) {
    setPerson(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    if (addingPerson && !person.name.trim()) return
    onSave(
      { ...form, contactId: addingPerson ? null : form.contactId || null },
      addingPerson ? person : null,
    )
  }

  const sortedContacts = [...contacts].sort((x, y) => x.name.localeCompare(y.name))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="application-form-title" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title" id="application-form-title">{application ? 'Edit application' : 'New application'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">
              <span>Company <span className="form-required">required</span></span>
              <input className="form-input" name="company" value={form.company} onChange={handleChange} placeholder="Company name" required />
            </label>
            <label className="form-label">
              <span>Role <span className="form-required">required</span></span>
              <input className="form-input" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Junior Frontend Engineer" required />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Status
              <select className="form-input" name="status" value={form.status} onChange={handleChange}>
                {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="form-label">
              Date applied
              <input className="form-input" type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Source
              <select className="form-input" name="source" value={form.source} onChange={handleChange}>
                <option value="">Not set</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="form-label">
              Work mode
              <select className="form-input" name="workMode" value={form.workMode} onChange={handleChange}>
                <option value="">Not set</option>
                {WORK_MODES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label className="form-label">
            Job link
            <input className="form-input" name="jobUrl" value={form.jobUrl} onChange={handleChange} placeholder="https://..." />
          </label>

          <label className="form-label">
            Contact
            <select className="form-input" name="contactId" value={form.contactId} onChange={handleChange}>
              <option value="">No one</option>
              {sortedContacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.company ? ` · ${c.company}` : ''}</option>
              ))}
              <option value={NEW_PERSON}>+ Add a new person…</option>
            </select>
          </label>

          {addingPerson && (
            <fieldset className="form-person">
              <legend>New person, also saved to Contacts</legend>
              <div className="form-row">
                <label className="form-label">
                  <span>Name <span className="form-required">required</span></span>
                  <input className="form-input" name="name" value={person.name} onChange={handlePerson} placeholder="Full name" required autoFocus />
                </label>
                <label className="form-label">
                  Their role
                  <input className="form-input" name="role" value={person.role} onChange={handlePerson} placeholder="e.g. Recruiter" />
                </label>
              </div>
              <label className="form-label">
                LinkedIn URL
                <input className="form-input" name="linkedinUrl" value={person.linkedinUrl} onChange={handlePerson} placeholder="https://linkedin.com/in/..." />
              </label>
            </fieldset>
          )}

          <div className="form-row">
            <label className="form-label">
              Next step
              <input className="form-input" name="nextStep" value={form.nextStep} onChange={handleChange} placeholder="e.g. Follow up, phone screen" />
            </label>
            <label className="form-label">
              Next step date
              <input className="form-input" type="date" name="nextStepDate" value={form.nextStepDate} onChange={handleChange} />
            </label>
          </div>

          <label className="form-label">
            Job description
            <textarea className="form-input form-textarea" name="jobDescription" value={form.jobDescription} onChange={handleChange}
              placeholder="Paste the ad here so you still have it after it closes" rows={4} />
          </label>

          <label className="form-label">
            Notes
            <textarea className="form-input form-textarea" name="notes" value={form.notes} onChange={handleChange}
              placeholder="Cover letter angle, salary talk, who you spoke to" rows={3} />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : application ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
