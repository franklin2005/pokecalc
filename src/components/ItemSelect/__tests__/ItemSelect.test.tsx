import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ItemSelect } from '../ItemSelect'

describe('ItemSelect', () => {
  it('should render input with placeholder', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search items...')
    expect(input).toBeDefined()
  })

  it('should render with "Held Item" label', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    expect(screen.getByText('Held Item')).toBeDefined()
  })

  it('should show selected item value in input', () => {
    render(<ItemSelect value="Focus Sash" onChange={vi.fn()} />)
    const input = document.querySelector('.item-select__input') as HTMLInputElement
    // The component syncs query with value when value changes externally and dropdown is closed
    expect(input.value).toBe('Focus Sash')
  })

  it('should show empty input when value is undefined', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = document.querySelector('.item-select__input') as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('should open dropdown and show filtered items when typing', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'Berry' } })
    const dropdown = document.querySelector('.item-select__dropdown')
    expect(dropdown).toBeDefined()
    const options = document.querySelectorAll('.item-select__option')
    // Should have "No Item" + filtered Berry items
    expect(options.length).toBeGreaterThan(1)
  })

  it('should filter items when typing', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'Berry' } })
    const options = document.querySelectorAll('.item-select__option-name')
    // All visible item options (excluding "No Item") should contain "Berry"
    const itemOptions = Array.from(options).filter(
      (o) => o.textContent !== 'No Item'
    )
    expect(itemOptions.length).toBeGreaterThan(0)
    itemOptions.forEach((opt) => {
      expect(opt.textContent?.toLowerCase()).toContain('berry')
    })
  })

  it('should show lock icon when disabled', () => {
    render(<ItemSelect value="Gengarite" onChange={vi.fn()} disabled={true} />)
    const icon = document.querySelector('.item-select__icon')
    expect(icon?.textContent?.trim()).toBe('lock')
  })

  it('should show expand icon when enabled', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const icon = document.querySelector('.item-select__icon')
    expect(icon?.textContent?.trim()).toBe('expand_more')
  })

  it('should not open dropdown when disabled', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} disabled={true} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'Berry' } })
    const dropdown = document.querySelector('.item-select__dropdown')
    expect(dropdown).toBeNull()
  })

  it('should call onChange with undefined when input is cleared', () => {
    const onChange = vi.fn()
    render(<ItemSelect value="Focus Sash" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('should call onChange when selecting an item from dropdown', () => {
    const onChange = vi.fn()
    render(<ItemSelect value={undefined} onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'Focus Sash' } })
    // Get the option <li> elements (not the inner spans)
    const optionLis = document.querySelectorAll('.item-select__option')
    // Skip the first one which is "No Item"
    const itemOption = optionLis[1]
    if (itemOption) {
      fireEvent.mouseDown(itemOption)
      expect(onChange).toHaveBeenCalledWith('Focus Sash')
    }
  })

  it('should show "No Item" option in dropdown', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'x' } })
    const noItemOption = document.querySelector('.item-select__option--no-item')
    expect(noItemOption).toBeDefined()
    expect(noItemOption?.textContent).toContain('No Item')
  })

  it('should show item category in dropdown options', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search items...')
    fireEvent.change(input, { target: { value: 'Leftovers' } })
    const category = document.querySelector('.item-select__option-category')
    expect(category).toBeDefined()
  })

  it('should limit filtered results to 20 items', () => {
    render(<ItemSelect value={undefined} onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search items...')
    // Use a query that matches many items (e.g., single letter)
    fireEvent.change(input, { target: { value: 'e' } })
    const options = document.querySelectorAll('.item-select__option')
    // "No Item" + up to 20 filtered items = max 21
    expect(options.length).toBeLessThanOrEqual(21)
  })
})
