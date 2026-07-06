import { describe, expect, it, beforeEach } from 'vitest'
import { addContact, deleteContact, getContacts, saveContacts, updateContact } from './storage'

// jsdom gives us a real localStorage, so these hit the actual API surface
// instead of a mock of it.
beforeEach(() => {
  localStorage.clear()
})

describe('getContacts', () => {
  it('returns null when nothing has been saved yet', () => {
    expect(getContacts()).toBeNull()
  })

  it('returns the parsed array after saveContacts', () => {
    saveContacts([{ id: '1', name: 'Ada' }])
    expect(getContacts()).toEqual([{ id: '1', name: 'Ada' }])
  })
})

describe('addContact', () => {
  it('appends to an empty store', () => {
    const result = addContact({ id: '1', name: 'Ada' })
    expect(result).toEqual([{ id: '1', name: 'Ada' }])
  })

  it('appends to an existing store without touching prior entries', () => {
    saveContacts([{ id: '1', name: 'Ada' }])
    const result = addContact({ id: '2', name: 'Grace' })
    expect(result).toEqual([{ id: '1', name: 'Ada' }, { id: '2', name: 'Grace' }])
  })
})

describe('updateContact', () => {
  it('replaces only the matching id', () => {
    saveContacts([{ id: '1', name: 'Ada' }, { id: '2', name: 'Grace' }])
    const result = updateContact({ id: '2', name: 'Grace Hopper' })
    expect(result).toEqual([{ id: '1', name: 'Ada' }, { id: '2', name: 'Grace Hopper' }])
  })
})

describe('deleteContact', () => {
  it('removes the matching id and leaves the rest', () => {
    saveContacts([{ id: '1', name: 'Ada' }, { id: '2', name: 'Grace' }])
    const result = deleteContact('1')
    expect(result).toEqual([{ id: '2', name: 'Grace' }])
  })
})
