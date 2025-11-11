import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Form from '@/fl-41/profiles/add/Form'

describe('Tests for add-profile form', () => {
  it('has a disabled submit button whilst either text input is empty', () => {
    render(<Form />)
    const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)
    expect(inputs).toHaveLength(2)

    const submit: HTMLButtonElement = screen.getByTestId('submitButton')
    expect(submit.disabled).toBe(true)

    fireEvent.change(inputs[0], { target: { value: 'any src value' } })
    expect(submit.disabled).toBe(true)

    fireEvent.change(inputs[1], { target: { value: 'any alt value' } })
    expect(submit.disabled).toBe(false)

    fireEvent.change(inputs[1], { target: { value: '' } })
    expect(submit.disabled).toBe(true)
  })

  it('clears after submission', () => {
    render(<Form />)
    const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)
    expect(inputs).toHaveLength(2)

    fireEvent.change(inputs[0], { target: { value: 'any src value' } })
    expect(inputs[0].value).toBe('any src value')
    fireEvent.change(inputs[1], { target: { value: 'any alt value' } })
    expect(inputs[1].value).toBe('any alt value')

    const submit: HTMLButtonElement = screen.getByTestId('submitButton')
    expect(submit.disabled).toBe(false)
    fireEvent.click(submit)
    expect(inputs[0].value).toBe('')
    expect(inputs[1].value).toBe('')
  })
})
