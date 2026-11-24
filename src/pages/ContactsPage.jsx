import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createContact, updateContact, deleteContact } from '../utils/api'
import { useToast } from '../hooks/useToast'
import { usePipeline } from '../hooks/usePipeline'
import Sidebar from '../components/Sidebar'
import ContactTable, { ContactTableSkeleton } from '../components/ContactTable'
import ContactDetail from '../components/ContactDetail'
import ContactForm from '../components/ContactForm'
import ToastContainer from '../components/Toast'
import Icon from '../components/Icon'
import { byFollowUpUrgency } from '../utils/followUp'
import './ContactsPage.css'

export default function ContactsPage({ onLock }) {
  const { contacts, setContacts, applications, loading, error, load, failed: fail } = usePipeline(onLock)
  const [params, setParams] = useSearchParams()
  const filterStatus = params.get('stage') ?? 'All'
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(() => params.get('open'))
  const [modal, setModal] = useState(null) // null | 'add' | contact object
  const [saving, setSaving] = useState(false)
  const { toasts, showToast } = useToast()

  const closeDetail = useCallback(() => setSelectedId(null), [])
  function openAdd() { setModal('add') }
  function openEdit(contact) { setModal(contact) }
  function closeModal() { setModal(null) }

  const failed = (action, err) => fail(showToast, action, err)

  async function handleSave(formData) {
    setSaving(true)
    try {
      if (modal === 'add') {
        const created = await createContact(formData)
        setContacts(prev => [created, ...prev])
        showToast('Contact added')
      } else {
        const updated = await updateContact(modal.id, formData)
        setContacts(prev => prev.map(c => c.id === updated.id ? updated : c))
        showToast('Contact updated')
      }
      closeModal()
    } catch (err) {
      failed('save', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(contact, status) {
    const previous = contact.status
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status } : c))
    try {
      const updated = await updateContact(contact.id, { ...contact, status })
      setContacts(prev => prev.map(c => c.id === updated.id ? updated : c))
      showToast(`Moved to ${status}`)
    } catch (err) {
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: previous } : c))
      failed('update', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteContact(id)
      setContacts(prev => prev.filter(c => c.id !== id))
      setSelectedId(null)
      showToast('Contact deleted')
    } catch (err) {
      failed('delete', err)
    }
  }

  const q = search.trim().toLowerCase()
  const visible = contacts
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .filter(c => !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q))
    .sort(byFollowUpUrgency)

  const selected = contacts.find(c => c.id === selectedId) ?? null
  const title = filterStatus === 'All' ? 'All contacts' : filterStatus

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
              placeholder="Search name or company"
              aria-label="Search contacts by name or company"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
          <button className="btn-primary topbar__add" onClick={openAdd} disabled={loading}>
            + Add Contact
          </button>
        </header>

        <div className="workspace__content">
          {loading && <ContactTableSkeleton />}

          {error && !loading && (
            <div className="state" role="alert">
              <p className="state__heading">Could not load contacts</p>
              <p className="state__body">{error}. Check your connection and try again.</p>
              <button className="btn-secondary" onClick={load}>Retry</button>
            </div>
          )}

          {!loading && !error && contacts.length === 0 && (
            <div className="state">
              <p className="state__heading">No contacts yet</p>
              <p className="state__body">Add the first person you reach out to on LinkedIn and track them from first message to interview.</p>
              <button className="btn-primary" onClick={openAdd}>+ Add Contact</button>
            </div>
          )}

          {!loading && !error && contacts.length > 0 && visible.length === 0 && (
            <div className="state">
              <p className="state__heading">No matches</p>
              <p className="state__body">
                {q ? `Nobody in ${title.toLowerCase()} matches “${search.trim()}”.` : `No contacts are in ${title} right now.`}
              </p>
              <button className="btn-secondary" onClick={() => { setParams({}); setSearch('') }}>
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <ContactTable contacts={visible} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </div>
      </main>

      {selected && (
        <ContactDetail
          contact={selected}
          applications={applications.filter(a => a.contactId === selected.id)}
          onClose={closeDetail}
          onEdit={openEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {modal && (
        <ContactForm
          contact={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
