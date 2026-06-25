import './DashboardBar.css'

const STATUSES = ['Not Contacted', 'Messaged', 'Replied', 'Interview', 'Closed']

const STATUS_KEYS = {
  'Not Contacted': 'not-contacted',
  'Messaged': 'messaged',
  'Replied': 'replied',
  'Interview': 'interview',
  'Closed': 'closed',
}

export default function DashboardBar({ contacts }) {
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = contacts.filter(c => c.status === s).length
    return acc
  }, {})

  return (
    <div className="dashboard-bar">
      <div className="dashboard-bar__item">
        <span className="dashboard-bar__count">{contacts.length}</span>
        <span className="dashboard-bar__label">Total</span>
      </div>
      <div className="dashboard-bar__divider" />
      {STATUSES.map(status => (
        <div key={status} className="dashboard-bar__item">
          <span className={`dashboard-bar__dot dashboard-bar__dot--${STATUS_KEYS[status]}`} />
          <span className="dashboard-bar__count">{counts[status]}</span>
          <span className="dashboard-bar__label">{status}</span>
        </div>
      ))}
    </div>
  )
}
