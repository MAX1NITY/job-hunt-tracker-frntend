import { beforeEach, describe, expect, it } from 'vitest'
import { getAccessKey, setAccessKey, clearAccessKey } from './accessKey'

beforeEach(() => localStorage.clear())

describe('accessKey', () => {
  it('returns an empty string when nothing is stored', () => {
    expect(getAccessKey()).toBe('')
  })

  it('stores a trimmed key and reads it back', () => {
    setAccessKey('  my-key \n')
    expect(getAccessKey()).toBe('my-key')
  })

  it('clears the key', () => {
    setAccessKey('my-key')
    clearAccessKey()
    expect(getAccessKey()).toBe('')
  })
})
