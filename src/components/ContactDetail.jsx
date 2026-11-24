import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import StatusBadge from './StatusBadge'
import { STATUSES } from '../utils/statuses'
import { describeFollowUp, formatLongDate } from '../utils/followUp'
import './ContactDetail.css'

export default function ContactDetail({ contact, applications = [], onClose, onEdit, onDelete, onStatusChange }) {
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const closeRef = useRef(null)

  // Reset transient state and move focus when a different contact opens.
  useEffect(() => {
    setConfirming(false)
    setCopied(false)
    closeRef.current?.focus({ preventScroll: true })
  }, [contact.id])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !document.querySelector('.modal')) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!confirming) return
    const t = setTimeout(() => setConfirming(false), 4000)
    return () => clearTimeout(t)
  }, [confirming])

  function copyEmail() {
    navigator.clipboard?.writeText(contact.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDelete() {
    if (!confirming) return setConfirming(true)
    onDelete(contact.id)
  }

  const due = describeFollowUp(contact.followUpDate)

  return (
    <aside className="contact-detail" aria-label={`${contact.name} details`}>
      <div className="contact-detail__bar">
        <button ref={closeRef} className="btn-ghost contact-detail__close" onClick={onClose} aria-label="Close details">
          <Icon name="x" size={16} />
        </button>
        <div className="contact-detail__bar-actions">
          <button className="btn-secondary" onClick={() => onEdit(contact)}>
            <Icon name="pencil" size={14} />
            Edit
          </button>
          <button
            className={confirming ? 'btn-danger' : 'btn-ghost contact-detail__delete'}
            onClick={handleDelete}
            aria-label={confirming ? 'Confirm delete' : 'Delete contact'}
            title={confirming ? undefined : 'Delete contact'}
          >
            <Icon name="trash" size={14} />
            {confirming && 'Confirm delete'}
          </button>
        </div>
      </div>

      <div className="contact-detail__body">
        <h2 className="contact-detail__name">{contact.name}</h2>
        <p className="contact-detail__sub">
          {[contact.role, contact.company].filter(Boolean).join(' · ')}
        </p>

        <dl className="contact-detail__fields">
          <dt>Status</dt>
          <dd>
            <select
              className="contact-detail__status"
              value={contact.status}
              onChange={e => onStatusChange(contact, e.target.value)}
              aria-label="Status"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </dd>

          <dt>Follow-up</dt>
          <dd className={`contact-detail__due contact-detail__due--${due.tone}`}>
            {contact.followUpDate
              ? <>{formatLongDate(contact.followUpDate)}{due.tone === 'overdue' || due.tone === 'today' ? <span>&nbsp;· {due.label}</span> : null}</>
              : <span className="contact-detail__empty">Not set</span>}
          </dd>

          <dt>Email</dt>
          <dd>
            {contact.email ? (
              <button className="contact-detail__copy" onClick={copyEmail} title="Copy email">
                <Icon name={copied ? 'check' : 'mail'} size={14} />
                <span className="contact-detail__truncate">{copied ? 'Copied' : contact.email}</span>
              </button>
            ) : <span className="contact-detail__empty">Not set</span>}
          </dd>

          <dt>LinkedIn</dt>
          <dd>
            {contact.linkedinUrl ? (
              <a className="contact-detail__link" href={contact.linkedinUrl} target="_blank" rel="noreferrer">
                Open profile
                <Icon name="link" size={12} />
              </a>
            ) : <span className="contact-detail__empty">Not set</span>}
          </dd>
        </dl>

        {applications.length > 0 && (
          <section className="contact-detail__notes">
            <h3>Applications</h3>
            <ul className="contact-detail__apps">
              {applications.map(a => (
                <li key={a.id}>
                  <Link to={`/applications?open=${a.id}`} className="contact-detail__app">
                    <span className="contact-detail__truncate">{a.role} · {a.company}</span>
                    <StatusBadge status={a.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="contact-detail__notes">
          <h3>Notes</h3>
          {contact.notes
            ? <p>{contact.notes}</p>
            : <p className="contact-detail__empty">No notes yet. Use Edit to add some.</p>}
        </section>
      </div>
    </aside>
  )
}
