import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createApplication, updateApplication, deleteApplication, createContact } from '../utils/api'
import { useToast } from '../hooks/useToast'
import { usePipeline } from '../hooks/usePipeline'
import Sidebar from '../components/Sidebar'
import { ContactTableSkeleton } from '../components/ContactTable'
import ApplicationTable from '../components/ApplicationTable'
import ApplicationDetail from '../components/ApplicationDetail'
import ApplicationForm from '../components/ApplicationForm'
import ToastContainer from '../components/Toast'
import Icon from '../components/Icon'
import { describeFollowUp } from '../utils/followUp'
// ponytail: same shell as the contacts page, so it shares its styles.
import './ContactsPage.css'

// Most urgent next step first, then most recently applied.
function byUrgency(a, b) {
  const da = describeFollowUp(a.nextStepDate).days ?? Infinity
  const db = describeFollowUp(b.nextStepDate).days ?? Infinity
  if (da !== db) return da - db
  return (b.appliedDate ?? '').localeCompare(a.appliedDate ?? '')
}

export default function ApplicationsPage({ onLock }) {
  const { contacts, setContacts, applications, setApplications, loading, error, load, failed: fail } = usePipeline(onLock)
  const [params, setParams] = useSearchParams()
  const filterStatus = params.get('stage') ?? 'All'
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(() => params.get('open'))
  const [modal, setModal] = useState(null) // null | 'add' | application object
  const [saving, setSaving] = useState(false)
  const { toasts, showToast } = useToast()

  const closeDetail = useCallback(() => setSelectedId(null), [])
  const failed = (action, err) => fail(showToast, action, err)

  async function handleSave(formData, newPerson) {
    setSaving(true)
    try {
      let contactId = formData.contactId
      if (newPerson) {
        const person = await createContact({ ...newPerson, company: formData.company })
        setContacts(prev => [person, ...prev])
        contactId = person.id
      }
      const data = { ...formData, contactId }
      if (modal === 'add') {
        const created = await createApplication(data)
        setApplications(prev => [created, ...prev])
        showToast(newPerson ? `Application added, ${newPerson.name} saved to Contacts` : 'Application added')
      } else {
        const updated = await updateApplication(modal.id, data)
        setApplications(prev => prev.map(a => a.id === updated.id ? updated : a))
        showToast('Application updated')
      }
      setModal(null)
    } catch (err) {
      failed('save', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(app, status) {
    const previous = app.status
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status } : a))
    try {
      const updated = await updateApplication(app.id, { ...app, status })
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a))
      showToast(`Moved to ${status}`)
    } catch (err) {
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: previous } : a))
      failed('update', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteApplication(id)
      setApplications(prev => prev.filter(a => a.id !== id))
      setSelectedId(null)
      showToast('Application deleted')
    } catch (err) {
      failed('delete', err)
    }
  }

  const q = search.trim().toLowerCase()
  const visible = applications
    .filter(a => filterStatus === 'All' || a.status === filterStatus)
    .filter(a => !q || a.role.toLowerCase().includes(q) || a.company.toLowerCase().includes(q))
    .sort(byUrgency)

  const selected = applications.find(a => a.id === selectedId) ?? null
  const title = filterStatus === 'All' ? 'All applications' : filterStatus

  return (
    <div className="app-shell">
      <Sidebar contacts={contacts} applications={applications} onLock={onLock} />

      <main className="workspace">
        <header className="topbar">
          <h1 className="topbar__title">
            {title}
            {!loading && <span className="topbar__count tabular">{visible.length}</span>}
          </h1>
          <label className="topbar__search">
            <Icon name="search" size={15} />
            <input
              type="search"
              placeholder="Search role or company"
              aria-label="Search applications by role or company"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
          <button className="btn-primary topbar__add" onClick={() => setModal('add')} disabled={loading}>
            + Add Application
          </button>
        </header>

        <div className="workspace__content">
          {loading && <ContactTableSkeleton />}

          {error && !loading && (
            <div className="state" role="alert">
              <p className="state__heading">Could not load applications</p>
              <p className="state__body">{error}. Check your connection and try again.</p>
              <button className="btn-secondary" onClick={load}>Retry</button>
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="state">
              <p className="state__heading">No applications yet</p>
              <p className="state__body">Log each job you apply for, link the person who referred you, and keep the next step in view.</p>
              <button className="btn-primary" onClick={() => setModal('add')}>+ Add Application</button>
            </div>
          )}

          {!loading && !error && applications.length > 0 && visible.length === 0 && (
            <div className="state">
              <p className="state__heading">No matches</p>
              <p className="state__body">
                {q ? `No application in ${title.toLowerCase()} matches “${search.trim()}”.` : `No applications are in ${title} right now.`}
              </p>
              <button className="btn-secondary" onClick={() => { setParams({}); setSearch('') }}>
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <ApplicationTable applications={visible} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </div>
      </main>

      {selected && (
        <ApplicationDetail
          application={selected}
          contact={contacts.find(c => c.id === selected.contactId)}
          onClose={closeDetail}
          onEdit={setModal}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {modal && (
        <ApplicationForm
          application={modal === 'add' ? null : modal}
          contacts={contacts}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
