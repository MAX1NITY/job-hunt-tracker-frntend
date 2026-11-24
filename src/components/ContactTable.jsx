import StatusBadge from './StatusBadge'
import Icon from './Icon'
import { describeFollowUp } from '../utils/followUp'
import './ContactTable.css'

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function ContactTableSkeleton() {
  return (
    <div className="contact-table contact-table--loading" aria-busy="true" aria-label="Loading contacts">
      {[0, 1, 2, 3, 4].map(n => (
        <div key={n} className="contact-table__skeleton-row">
          <span className="shimmer shimmer--avatar" />
          <span className="shimmer shimmer--name" />
          <span className="shimmer shimmer--company" />
          <span className="shimmer shimmer--badge" />
        </div>
      ))}
    </div>
  )
}

export default function ContactTable({ contacts, selectedId, onSelect }) {
  return (
    <table className="contact-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Company</th>
          <th scope="col">Status</th>
          <th scope="col">Follow-up</th>
          <th scope="col"><span className="visually-hidden">LinkedIn</span></th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(c => {
          const due = describeFollowUp(c.followUpDate)
          const selected = c.id === selectedId
          return (
            <tr
              key={c.id}
              className={`contact-row${selected ? ' contact-row--selected' : ''}`}
              onClick={() => onSelect(c.id)}
            >
              <td className="contact-row__name-cell">
                <span className="contact-row__avatar" aria-hidden="true">{initials(c.name)}</span>
                <button
                  className="contact-row__name"
                  aria-pressed={selected}
                  onClick={e => { e.stopPropagation(); onSelect(c.id) }}
                >
                  {c.name}
                </button>
                {c.role && <span className="contact-row__role">{c.role}</span>}
              </td>
              <td className="contact-row__company">{c.company}</td>
              <td className="contact-row__status"><StatusBadge status={c.status} /></td>
              <td className={`contact-row__due contact-row__due--${due.tone} tabular`}>
                {(due.tone === 'overdue' || due.tone === 'today') && <Icon name="calendar" size={13} />}
                {due.label}
              </td>
              <td className="contact-row__link">
                {c.linkedinUrl && (
                  <a
                    href={c.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    aria-label={`${c.name} on LinkedIn`}
                  >
                    <Icon name="link" size={14} />
                  </a>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
