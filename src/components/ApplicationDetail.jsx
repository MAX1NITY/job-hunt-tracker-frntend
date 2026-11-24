import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { APP_STATUSES } from '../utils/statuses'
import { describeFollowUp, formatLongDate } from '../utils/followUp'
// ponytail: same panel as a contact's, so it shares its styles.
import './ContactDetail.css'

const Empty = () => <span className="contact-detail__empty">Not set</span>

export default function ApplicationDetail({ application: a, contact, onClose, onEdit, onDelete, onStatusChange }) {
  const [confirming, setConfirming] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    setConfirming(false)
    closeRef.current?.focus({ preventScroll: true })
  }, [a.id])

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

  function handleDelete() {
    if (!confirming) return setConfirming(true)
    onDelete(a.id)
  }

  const due = describeFollowUp(a.nextStepDate)
  const urgent = due.tone === 'overdue' || due.tone === 'today'

  return (
    <aside className="contact-detail" aria-label={`${a.role} at ${a.company} details`}>
      <div className="contact-detail__bar">
        <button ref={closeRef} className="btn-ghost contact-detail__close" onClick={onClose} aria-label="Close details">
          <Icon name="x" size={16} />
        </button>
        <div className="contact-detail__bar-actions">
          <button className="btn-secondary" onClick={() => onEdit(a)}>
            <Icon name="pencil" size={14} />
            Edit
          </button>
          <button
            className={confirming ? 'btn-danger' : 'btn-ghost contact-detail__delete'}
            onClick={handleDelete}
            aria-label={confirming ? 'Confirm delete' : 'Delete application'}
            title={confirming ? undefined : 'Delete application'}
          >
            <Icon name="trash" size={14} />
            {confirming && 'Confirm delete'}
          </button>
        </div>
      </div>

      <div className="contact-detail__body">
        <h2 className="contact-detail__name">{a.role}</h2>
        <p className="contact-detail__sub">{[a.company, a.workMode].filter(Boolean).join(' · ')}</p>

        <dl className="contact-detail__fields">
          <dt>Status</dt>
          <dd>
            <select
              className="contact-detail__status"
              value={a.status}
              onChange={e => onStatusChange(a, e.target.value)}
              aria-label="Status"
            >
              {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </dd>

          <dt>Next step</dt>
          <dd className={`contact-detail__due contact-detail__due--${due.tone}`}>
            {a.nextStep || a.nextStepDate ? (
              <span className="contact-detail__truncate">
                {[a.nextStep, a.nextStepDate && (urgent ? due.label : formatLongDate(a.nextStepDate))]
                  .filter(Boolean).join(' · ')}
              </span>
            ) : <Empty />}
          </dd>

          <dt>Applied</dt>
          <dd>{a.appliedDate ? formatLongDate(a.appliedDate) : <Empty />}</dd>

          <dt>Source</dt>
          <dd>{a.source || <Empty />}</dd>

          <dt>Contact</dt>
          <dd>
            {contact
              ? <Link className="contact-detail__link" to={`/contacts?open=${contact.id}`}>{contact.name}</Link>
              : <Empty />}
          </dd>

          <dt>Posting</dt>
          <dd>
            {a.jobUrl ? (
              <a className="contact-detail__link" href={a.jobUrl} target="_blank" rel="noreferrer">
                Open job ad
                <Icon name="link" size={12} />
              </a>
            ) : <Empty />}
          </dd>
        </dl>

        <section className="contact-detail__notes">
          <h3>Notes</h3>
          {a.notes
            ? <p>{a.notes}</p>
            : <p className="contact-detail__empty">No notes yet. Use Edit to add some.</p>}
        </section>

        <section className="contact-detail__notes">
          <h3>Job description</h3>
          {a.jobDescription
            ? <p className="contact-detail__pre">{a.jobDescription}</p>
            : <p className="contact-detail__empty">Paste the ad in with Edit. Postings disappear once they close.</p>}
        </section>
      </div>
    </aside>
  )
}
