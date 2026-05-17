import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AbilitySelect } from '../AbilitySelect'
import { Generations } from '@smogon/calc'

describe('AbilitySelect', () => {
  const gen = Generations.get(9)
  const defaultProps = {
    species: 'Venusaur' as const,
    value: 'Overgrow' as const,
    onChange: vi.fn(),
    onFocus: vi.fn(),
    onToggle: vi.fn(),
    isOpen: false,
    query: '',
    onQueryChange: vi.fn(),
    gen,
  }

  it('should render with label', () => {
    render(<AbilitySelect {...defaultProps} />)
    expect(screen.getByText('Ability')).toBeDefined()
  })

  it('should render input with placeholder', () => {
    render(<AbilitySelect {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search abilities...')
    expect(input).toBeDefined()
  })

  it('should show disabled placeholder when no species selected', () => {
    render(<AbilitySelect {...defaultProps} species={null} value={undefined} />)
    const input = screen.getByPlaceholderText('Select a species first')
    expect(input).toBeDefined()
  })

  it('should be disabled when no species selected', () => {
    render(<AbilitySelect {...defaultProps} species={null} value={undefined} />)
    const input = screen.getByPlaceholderText('Select a species first')
    expect((input as HTMLInputElement).disabled).toBe(true)
  })

  it('should be enabled when species is selected', () => {
    render(<AbilitySelect {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search abilities...')
    expect((input as HTMLInputElement).disabled).toBe(false)
  })

  it('should call onFocus when input is focused', () => {
    const onFocus = vi.fn()
    render(<AbilitySelect {...defaultProps} onFocus={onFocus} />)
    const input = screen.getByPlaceholderText('Search abilities...')
    fireEvent.focus(input)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('should not call onFocus when disabled', () => {
    const onFocus = vi.fn()
    render(<AbilitySelect {...defaultProps} species={null} value={undefined} onFocus={onFocus} />)
    const input = screen.getByPlaceholderText('Select a species first')
    fireEvent.focus(input)
    expect(onFocus).not.toHaveBeenCalled()
  })

  it('should call onQueryChange when typing', () => {
    const onQueryChange = vi.fn()
    render(<AbilitySelect {...defaultProps} onQueryChange={onQueryChange} />)
    const input = screen.getByPlaceholderText('Search abilities...')
    fireEvent.change(input, { target: { value: 'chlor' } })
    expect(onQueryChange).toHaveBeenCalledWith('chlor')
  })

  it('should call onChange with undefined when input is cleared', () => {
    const onChange = vi.fn()
    render(<AbilitySelect {...defaultProps} onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search abilities...')
    fireEvent.change(input, { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('should render the expand_more icon when enabled', () => {
    render(<AbilitySelect {...defaultProps} />)
    const icon = document.querySelector('.ability-select__icon')
    expect(icon?.textContent?.trim()).toBe('expand_more')
  })

  it('should render the lock icon when disabled', () => {
    render(<AbilitySelect {...defaultProps} species={null} value={undefined} />)
    const icon = document.querySelector('.ability-select__icon')
    expect(icon?.textContent?.trim()).toBe('lock')
  })

  it('should display query value in input when provided', () => {
    render(<AbilitySelect {...defaultProps} query="Chlorophyll" />)
    const input = document.querySelector('.ability-select__input') as HTMLInputElement
    expect(input.value).toBe('Chlorophyll')
  })

  it('should display selected value when query is empty', () => {
    render(<AbilitySelect {...defaultProps} value="Overgrow" query="" />)
    const input = document.querySelector('.ability-select__input') as HTMLInputElement
    expect(input.value).toBe('Overgrow')
  })

  it('should display empty string when disabled', () => {
    render(<AbilitySelect {...defaultProps} species={null} value={undefined} query="test" />)
    const input = document.querySelector('.ability-select__input') as HTMLInputElement
    expect(input.value).toBe('')
  })
})
