import { useState, useEffect } from 'react'
import { fetchContacts, createContact, updateContact, deleteContact } from '../utils/api'
import { useToast } from '../hooks/useToast'
import ContactCard from '../components/ContactCard'
import ContactCardSkeleton from '../components/ContactCardSkeleton'
import ContactForm from '../components/ContactForm'
import DashboardBar from '../components/DashboardBar'
import ToastContainer from '../components/Toast'
import './ContactsPage.css'

const ALL_STATUSES = ['Not Contacted', 'Messaged', 'Replied', 'Interview', 'Closed']

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | contact object
  const [saving, setSaving] = useState(false)
  const { toasts, showToast } = useToast()

  function load() {
    setLoading(true)
    setError(null)
    fetchContacts()
      .then(setContacts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function openAdd() { setModal('add') }
  function openEdit(contact) { setModal(contact) }
  function closeModal() { setModal(null) }

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
      showToast(`Failed to save: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteContact(id)
      setContacts(prev => prev.filter(c => c.id !== id))
      showToast('Contact deleted')
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, 'error')
    }
  }

  const visible = contacts
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .filter(c => {
      const q = search.toLowerCase()
      return !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    })

  const isFiltered = filterStatus !== 'All' || search.trim() !== ''

  return (
    <div className="contacts-page">
      <div className="contacts-page__header">
        <h1 className="contacts-page__title">Job Hunt Tracker</h1>
        <button className="btn-primary" onClick={openAdd} disabled={loading}>
          + Add Contact
        </button>
      </div>

      <DashboardBar contacts={contacts} />

      <div className="contacts-page__controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab${filterStatus === 'All' ? ' filter-tab--active' : ''}`}
            onClick={() => setFilterStatus('All')}
          >
            All
          </button>
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              className={`filter-tab${filterStatus === s ? ' filter-tab--active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search by name or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="contacts-list">
          {[1, 2, 3].map(n => <ContactCardSkeleton key={n} />)}
        </div>
      )}

      {error && !loading && (
        <div className="contacts-page__error">
          <p>Could not load contacts: {error}</p>
          <button className="btn-secondary" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div className="contacts-page__empty">
          <p className="contacts-page__empty-heading">No contacts yet</p>
          <p>Start tracking your outreach by adding your first contact.</p>
          <button className="btn-primary" onClick={openAdd}>+ Add Contact</button>
        </div>
      )}

      {!loading && !error && contacts.length > 0 && visible.length === 0 && (
        <div className="contacts-page__empty">
          <p className="contacts-page__empty-heading">No results</p>
          <p>No contacts match your current filter or search.</p>
          <button className="btn-secondary" onClick={() => { setFilterStatus('All'); setSearch('') }}>
            Clear filters
          </button>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="contacts-list">
          {visible.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
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
