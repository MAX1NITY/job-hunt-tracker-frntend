import { STATUS_KEYS } from '../utils/statuses'
import './StatusBadge.css'

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${STATUS_KEYS[status] ?? 'not-contacted'}`}>
      {status}
    </span>
  )
}
