import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ItemSelect } from '../ItemSelect'

describe('ItemSelect', () => {
  const defaultProps = {
    value: undefined as string | undefined,
    onChange: vi.fn(),
    onFocus: vi.fn(),
    onToggle: vi.fn(),
    isOpen: false,
    query: '',
    onQueryChange: vi.fn(),
  }

  it('should render input with placeholder', () => {
    render(<ItemSelect {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search items...')
    expect(input).toBeDefined()
  })

  it('should render with "Held Item" label', () => {
    render(<ItemSelect {...defaultProps} />)
    expect(screen.getByText('Held Item')).toBeDefined()
  })

  it('should show selected item value in input when query is empty', () => {
    render(<ItemSelect {...defaultProps} value="Focus Sash" />)
    const input = document.querySelector('.item-select__input') as HTMLInputElement
    expect(input.value).toBe('Focus Sash')
  })

  it('should show empty input when value is undefined and query is empty', () => {
    render(<ItemSelect {...defaultProps} value={undefined} />)
    const input = document.querySelector('.item-select__input') as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('should show query value in input when provided', () => {
    render(<ItemSelect {...defaultProps} query="Berry" />)
    const input = document.querySelector('.item-select__input') as HTMLInputElement
    expect(input.value).toBe('Berry')
  })

  it('should call onFocus when input is focused', () => {
    const onFocus = vi.fn()
    render(<ItemSelect {...defaultProps} onFocus={onFocus} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.focus(input)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('should not call onFocus when disabled', () => {
    const onFocus = vi.fn()
    render(<ItemSelect {...defaultProps} disabled={true} onFocus={onFocus} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.focus(input)
    expect(onFocus).not.toHaveBeenCalled()
  })

  it('should call onQueryChange when typing', () => {
    const onQueryChange = vi.fn()
    render(<ItemSelect {...defaultProps} onQueryChange={onQueryChange} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'Berry' } })
    expect(onQueryChange).toHaveBeenCalledWith('Berry')
  })

  it('should call onChange with undefined when input is cleared', () => {
    const onChange = vi.fn()
    render(<ItemSelect {...defaultProps} value="Focus Sash" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('should show lock icon when disabled', () => {
    render(<ItemSelect {...defaultProps} value="Gengarite" disabled={true} />)
    const icon = document.querySelector('.item-select__icon')
    expect(icon?.textContent?.trim()).toBe('lock')
  })

  it('should show expand icon when enabled', () => {
    render(<ItemSelect {...defaultProps} />)
    const icon = document.querySelector('.item-select__icon')
    expect(icon?.textContent?.trim()).toBe('expand_more')
  })
})
