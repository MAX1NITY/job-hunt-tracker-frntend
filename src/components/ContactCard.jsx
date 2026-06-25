import StatusBadge from './StatusBadge'
import './ContactCard.css'

function isOverdue(followUpDate) {
  if (!followUpDate) return false
  return new Date(followUpDate + 'T00:00:00') < new Date(new Date().toDateString())
}

export default function ContactCard({ contact, onEdit, onDelete }) {
  const overdue = isOverdue(contact.followUpDate)

  return (
    <div className="contact-card">
      <div className="contact-card__header">
        <div className="contact-card__info">
          <h3 className="contact-card__name">{contact.name}</h3>
          <p className="contact-card__sub">{contact.role}{contact.role && contact.company ? ' · ' : ''}{contact.company}</p>
        </div>
        <StatusBadge status={contact.status} />
      </div>

      {contact.notes && (
        <p className="contact-card__notes">{contact.notes}</p>
      )}

      <div className="contact-card__footer">
        {contact.followUpDate ? (
          <span className={`contact-card__followup${overdue ? ' contact-card__followup--overdue' : ''}`}>
            {overdue ? '⚠ Overdue · ' : 'Follow up · '}
            {new Date(contact.followUpDate + 'T00:00:00').toLocaleDateString('en-AU', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        ) : (
          <span />
        )}

        <div className="contact-card__actions">
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-card__link"
            >
              LinkedIn
            </a>
          )}
          <button className="contact-card__btn contact-card__btn--edit" onClick={() => onEdit(contact)}>
            Edit
          </button>
          <button className="contact-card__btn contact-card__btn--delete" onClick={() => onDelete(contact.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
