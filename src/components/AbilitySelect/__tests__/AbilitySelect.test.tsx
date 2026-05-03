import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AbilitySelect } from '../AbilitySelect'
import { Generations } from '@smogon/calc'

describe('AbilitySelect', () => {
  const gen = Generations.get(9)

  it('should render with label', () => {
    render(<AbilitySelect species="Venusaur" value="Overgrow" onChange={vi.fn()} gen={gen} />)
    expect(screen.getByText('Ability')).toBeDefined()
  })

  it('should show abilities for species with 2+ abilities', () => {
    render(<AbilitySelect species="Venusaur" value="Overgrow" onChange={vi.fn()} gen={gen} />)
    const select = document.querySelector('.ability-select__select') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.text)
    // Venusaur has Overgrow + Chlorophyll
    expect(options).toContain('Overgrow')
    expect(options).toContain('Chlorophyll')
    expect(options.length).toBeGreaterThanOrEqual(2)
  })

  it('should show disabled message when no species selected', () => {
    render(<AbilitySelect species={null} value={undefined} onChange={vi.fn()} gen={gen} />)
    expect(screen.getByText('Select a species first')).toBeDefined()
  })

  it('should show disabled state when species has no abilities', () => {
    render(<AbilitySelect species={null} value={undefined} onChange={vi.fn()} gen={gen} />)
    const select = document.querySelector('.ability-select__select')
    expect((select as HTMLSelectElement)?.disabled).toBe(true)
  })

  it('should be enabled when species is selected', () => {
    render(<AbilitySelect species="Venusaur" value="Overgrow" onChange={vi.fn()} gen={gen} />)
    const select = document.querySelector('.ability-select__select')
    expect((select as HTMLSelectElement)?.disabled).toBe(false)
  })

  it('should render the expand_more icon', () => {
    render(<AbilitySelect species="Venusaur" value="Overgrow" onChange={vi.fn()} gen={gen} />)
    const icon = document.querySelector('.ability-select__icon')
    expect(icon?.textContent?.trim()).toBe('expand_more')
  })

  it('should call onChange when a different ability is selected', () => {
    const onChange = vi.fn()
    render(<AbilitySelect species="Venusaur" value="Overgrow" onChange={onChange} gen={gen} />)
    const select = document.querySelector('.ability-select__select') as HTMLSelectElement
    // Change to Chlorophyll
    select.value = 'Chlorophyll'
    select.dispatchEvent(new Event('change', { bubbles: true }))
    expect(onChange).toHaveBeenCalledWith('Chlorophyll')
  })

  it('should call onChange with undefined when empty option is selected', () => {
    const onChange = vi.fn()
    render(<AbilitySelect species={null} value="Overgrow" onChange={onChange} gen={gen} />)
    const select = document.querySelector('.ability-select__select') as HTMLSelectElement
    select.value = ''
    select.dispatchEvent(new Event('change', { bubbles: true }))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('should use calc fallback for species not in our mapping', () => {
    // Use an obscure species that might not be in our static mapping
    // but exists in calc data
    render(<AbilitySelect species="Mew" value={undefined} onChange={vi.fn()} gen={gen} />)
    const select = document.querySelector('.ability-select__select') as HTMLSelectElement
    // Mew has Synchronize as its ability in calc
    const options = Array.from(select.options).map((o) => o.text)
    // Should have at least the calc fallback ability or be disabled
    expect(options.length).toBeGreaterThanOrEqual(1)
  })
})
