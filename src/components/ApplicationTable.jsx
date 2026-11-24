import StatusBadge from './StatusBadge'
import Icon from './Icon'
import { describeFollowUp } from '../utils/followUp'
// ponytail: same row layout as the contacts table, so it shares its styles.
import './ContactTable.css'

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function ApplicationTable({ applications, selectedId, onSelect }) {
  return (
    <table className="contact-table">
      <thead>
        <tr>
          <th scope="col">Role</th>
          <th scope="col">Company</th>
          <th scope="col">Status</th>
          <th scope="col">Next step</th>
          <th scope="col"><span className="visually-hidden">Job posting</span></th>
        </tr>
      </thead>
      <tbody>
        {applications.map(a => {
          const due = describeFollowUp(a.nextStepDate)
          const selected = a.id === selectedId
          return (
            <tr
              key={a.id}
              className={`contact-row${selected ? ' contact-row--selected' : ''}`}
              onClick={() => onSelect(a.id)}
            >
              <td className="contact-row__name-cell">
                <span className="contact-row__avatar contact-row__avatar--square" aria-hidden="true">{initials(a.company)}</span>
                <button
                  className="contact-row__name"
                  aria-pressed={selected}
                  onClick={e => { e.stopPropagation(); onSelect(a.id) }}
                >
                  {a.role}
                </button>
                {a.workMode && <span className="contact-row__role">{a.workMode}</span>}
              </td>
              <td className="contact-row__company">{a.company}</td>
              <td className="contact-row__status"><StatusBadge status={a.status} /></td>
              <td className={`contact-row__due contact-row__due--${due.tone} tabular`} title={a.nextStep || undefined}>
                {(due.tone === 'overdue' || due.tone === 'today') && <Icon name="calendar" size={13} />}
                {due.label}
              </td>
              <td className="contact-row__link">
                {a.jobUrl && (
                  <a
                    href={a.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    aria-label={`${a.role} at ${a.company} job posting`}
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
