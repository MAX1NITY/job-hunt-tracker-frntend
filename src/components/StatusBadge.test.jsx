import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="Replied" />)
    expect(screen.getByText('Replied')).toBeInTheDocument()
  })

  it('maps a known status to its modifier class', () => {
    render(<StatusBadge status="Interview" />)
    expect(screen.getByText('Interview')).toHaveClass('status-badge--interview')
  })

  it('falls back to the "not-contacted" class for an unrecognized status', () => {
    render(<StatusBadge status="Ghosted" />)
    expect(screen.getByText('Ghosted')).toHaveClass('status-badge--not-contacted')
  })
})
