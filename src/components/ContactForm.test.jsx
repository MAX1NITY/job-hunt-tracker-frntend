import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ContactForm from './ContactForm'

describe('ContactForm', () => {
  it('does not call onSave when required fields are blank', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<ContactForm onSave={onSave} onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Add Contact' }))

    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with form values once name and company are filled in', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<ContactForm onSave={onSave} onClose={() => {}} />)

    await user.type(screen.getByPlaceholderText('Full name'), 'Ada Lovelace')
    await user.type(screen.getByPlaceholderText('Company name'), 'Analytical Engines Inc')
    await user.click(screen.getByRole('button', { name: 'Add Contact' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada Lovelace', company: 'Analytical Engines Inc', followUpDate: null })
    )
  })

  it('pre-fills the form when editing an existing contact', () => {
    render(
      <ContactForm
        contact={{ name: 'Grace Hopper', company: 'Navy', status: 'Interview' }}
        onSave={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.getByPlaceholderText('Full name')).toHaveValue('Grace Hopper')
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  it('disables the submit button while saving', () => {
    render(<ContactForm onSave={() => {}} onClose={() => {}} saving />)
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
  })
})
