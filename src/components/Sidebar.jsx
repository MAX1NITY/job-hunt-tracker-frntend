import Icon from './Icon'
import { STATUSES, STATUS_KEYS } from '../utils/statuses'
import './Sidebar.css'

export default function Sidebar({ contacts, filterStatus, onFilter, onLock }) {
  const count = s => contacts.filter(c => c.status === s).length
  const views = [{ id: 'All', label: 'All contacts', n: contacts.length }]
    .concat(STATUSES.map(s => ({ id: s, label: s, n: count(s) })))

  return (
    <nav className="sidebar" aria-label="Views">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">J</span>
        <span className="sidebar__name">Job Hunt Tracker</span>
      </div>

      <p className="sidebar__heading">Pipeline</p>
      <ul className="sidebar__list">
        {views.map(v => (
          <li key={v.id}>
            <button
              className={`sidebar__item${filterStatus === v.id ? ' sidebar__item--active' : ''}`}
              aria-pressed={filterStatus === v.id}
              onClick={() => onFilter(v.id)}
            >
              {v.id === 'All'
                ? <Icon name="users" size={15} className="sidebar__icon" />
                : <span className={`sidebar__dot sidebar__dot--${STATUS_KEYS[v.id]}`} aria-hidden="true" />}
              <span className="sidebar__label">{v.label}</span>
              <span className="sidebar__count tabular">{v.n}</span>
            </button>
          </li>
        ))}
      </ul>

      <button className="sidebar__lock btn-ghost" onClick={() => onLock()} title="Forget the access key on this device">
        <Icon name="lock" size={15} />
        Lock
      </button>
    </nav>
  )
}
