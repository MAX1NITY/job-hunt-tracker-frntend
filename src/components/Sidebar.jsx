import { Link, useLocation, useSearchParams } from 'react-router-dom'
import Icon from './Icon'
import { STATUSES, APP_STATUSES, STATUS_KEYS } from '../utils/statuses'
import './Sidebar.css'

function Group({ heading, path, allLabel, statuses, items, active }) {
  const [params] = useSearchParams()
  const stage = params.get('stage') ?? 'All'
  const views = [{ id: 'All', label: allLabel, n: items.length }]
    .concat(statuses.map(s => ({ id: s, label: s, n: items.filter(i => i.status === s).length })))

  return (
    <>
      <li className="sidebar__heading">{heading}</li>
      {views.map(v => {
        const current = active && stage === v.id
        return (
          // Off-page stages are hidden in the mobile strip; only "All" stays as the switch.
          <li key={v.id} className={!active && v.id !== 'All' ? 'sidebar__li--offpage' : undefined}>
            <Link
              to={v.id === 'All' ? path : `${path}?stage=${encodeURIComponent(v.id)}`}
              className={`sidebar__item${current ? ' sidebar__item--active' : ''}`}
              aria-current={current ? 'page' : undefined}
            >
              {v.id === 'All'
                ? <Icon name={path === '/contacts' ? 'users' : 'briefcase'} size={15} className="sidebar__icon" />
                : <span className={`sidebar__dot sidebar__dot--${STATUS_KEYS[v.id]}`} aria-hidden="true" />}
              <span className="sidebar__label">{v.label}</span>
              <span className="sidebar__count tabular">{v.n}</span>
            </Link>
          </li>
        )
      })}
    </>
  )
}

export default function Sidebar({ contacts, applications, onLock }) {
  const { pathname } = useLocation()

  return (
    <nav className="sidebar" aria-label="Views">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">J</span>
        <span className="sidebar__name">Job Hunt Tracker</span>
      </div>

      <ul className="sidebar__list">
        <Group heading="Contacts" path="/contacts" allLabel="All contacts"
          statuses={STATUSES} items={contacts} active={pathname === '/contacts'} />
        <Group heading="Applications" path="/applications" allLabel="All applications"
          statuses={APP_STATUSES} items={applications} active={pathname === '/applications'} />
      </ul>

      <button className="sidebar__lock btn-ghost" onClick={() => onLock()} title="Forget the access key on this device">
        <Icon name="lock" size={15} />
        Lock
      </button>
    </nav>
  )
}
