import './StatusBadge.css'

const STATUS_KEYS = {
  'Not Contacted': 'not-contacted',
  'Messaged': 'messaged',
  'Replied': 'replied',
  'Interview': 'interview',
  'Closed': 'closed',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${STATUS_KEYS[status] ?? 'not-contacted'}`}>
      {status}
    </span>
  )
}
