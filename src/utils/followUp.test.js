import { describe, expect, it } from 'vitest'
import { byFollowUpUrgency, describeFollowUp } from './followUp'

const NOW = new Date(2026, 10, 24, 15, 30) // Tue 24 Nov 2026, mid-afternoon

describe('describeFollowUp', () => {
  it('handles a missing date', () => {
    expect(describeFollowUp(null, NOW).tone).toBe('none')
  })

  it('counts overdue days', () => {
    expect(describeFollowUp('2026-11-22', NOW)).toEqual({ tone: 'overdue', label: '2d overdue', days: -2 })
  })

  it('treats the same calendar day as today regardless of time', () => {
    expect(describeFollowUp('2026-11-24', NOW).tone).toBe('today')
  })

  it('labels tomorrow and the coming week as soon', () => {
    expect(describeFollowUp('2026-11-25', NOW)).toEqual({ tone: 'soon', label: 'Tomorrow', days: 1 })
    expect(describeFollowUp('2026-11-28', NOW).tone).toBe('soon')
  })

  it('labels dates a week or more away as later', () => {
    expect(describeFollowUp('2026-12-10', NOW).tone).toBe('later')
  })
})

describe('byFollowUpUrgency', () => {
  it('puts overdue first, then today, upcoming, and undated last', () => {
    const t = new Date()
    const iso = n => { const d = new Date(t); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
    const rows = [{ id: 'none', followUpDate: null }, { id: 'later', followUpDate: iso(9) },
      { id: 'today', followUpDate: iso(0) }, { id: 'old', followUpDate: iso(-5) }, { id: 'late', followUpDate: iso(-1) }]
    expect(rows.sort(byFollowUpUrgency).map(r => r.id)).toEqual(['old', 'late', 'today', 'later', 'none'])
  })
})
