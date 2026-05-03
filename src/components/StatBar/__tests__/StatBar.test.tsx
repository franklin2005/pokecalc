import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatBar } from '../StatBar'
import type { StatName } from '../../../types/calc'

describe('StatBar', () => {
  const defaultProps = {
    label: 'Atk',
    value: 147,
    maxValue: 200,
    colorClass: 'stat-bar__fill--attack',
    spValue: 32,
    spMax: 32,
    spTotal: 32,
    onSPChange: vi.fn(),
    natureEffect: 'neutral' as const,
    statKey: 'atk' as StatName,
  }

  it('should render label and value', () => {
    render(<StatBar {...defaultProps} />)
    expect(screen.getByText('Atk')).toBeDefined()
    expect(screen.getByText('147')).toBeDefined()
  })

  it('should render base value when provided', () => {
    render(<StatBar {...defaultProps} baseValue={82} />)
    expect(screen.getByText('82')).toBeDefined()
  })

  it('should not render base value when not provided', () => {
    render(<StatBar {...defaultProps} />)
    const baseElements = document.querySelectorAll('.stat-bar__base-value')
    expect(baseElements.length).toBe(0)
  })

  it('should render SP count text in value/max format', () => {
    render(<StatBar {...defaultProps} />)
    const spCount = document.querySelector('.stat-bar__sp-count')
    expect(spCount?.textContent).toBe('32/32')
  })

  it('should show boosted nature effect', () => {
    render(<StatBar {...defaultProps} natureEffect="boosted" />)
    const natureEl = document.querySelector('.stat-bar__nature--boosted')
    expect(natureEl).toBeDefined()
    expect(natureEl?.textContent).toBe('↑+10%')
  })

  it('should show hindered nature effect', () => {
    render(<StatBar {...defaultProps} natureEffect="hindered" />)
    const natureEl = document.querySelector('.stat-bar__nature--hindered')
    expect(natureEl).toBeDefined()
    expect(natureEl?.textContent).toBe('↓−10%')
  })

  it('should show neutral nature effect', () => {
    render(<StatBar {...defaultProps} natureEffect="neutral" />)
    const natureEl = document.querySelector('.stat-bar__nature--neutral')
    expect(natureEl).toBeDefined()
    expect(natureEl?.textContent).toBe('—')
  })

  it('should render SP number input', () => {
    render(<StatBar {...defaultProps} />)
    const numberInput = document.querySelector('.stat-bar__sp-number')
    expect(numberInput).toBeDefined()
  })

  it('should render SP range input', () => {
    render(<StatBar {...defaultProps} />)
    const rangeInput = document.querySelector('.stat-bar__sp-input')
    expect(rangeInput).toBeDefined()
    expect((rangeInput as HTMLInputElement).type).toBe('range')
  })

  it('should disable inputs when SP total cap reached and current SP is 0', () => {
    render(<StatBar {...defaultProps} spValue={0} spTotal={66} />)
    const rangeInput = document.querySelector('.stat-bar__sp-input')
    const numberInput = document.querySelector('.stat-bar__sp-number')
    expect((rangeInput as HTMLInputElement)?.disabled).toBe(true)
    expect((numberInput as HTMLInputElement)?.disabled).toBe(true)
  })

  it('should enable inputs when SP total is below cap', () => {
    render(<StatBar {...defaultProps} spValue={10} spTotal={50} />)
    const rangeInput = document.querySelector('.stat-bar__sp-input')
    const numberInput = document.querySelector('.stat-bar__sp-number')
    expect((rangeInput as HTMLInputElement)?.disabled).toBe(false)
    expect((numberInput as HTMLInputElement)?.disabled).toBe(false)
  })

  it('should call onSPChange when range input changes', () => {
    const onSPChange = vi.fn()
    render(<StatBar {...defaultProps} onSPChange={onSPChange} />)
    const rangeInput = screen.getByLabelText('Atk SPs')
    fireEvent.change(rangeInput, { target: { value: '16' } })
    expect(onSPChange).toHaveBeenCalledWith(16)
  })

  it('should call onSPChange when number input changes', () => {
    const onSPChange = vi.fn()
    render(<StatBar {...defaultProps} onSPChange={onSPChange} />)
    const numberInput = screen.getByLabelText('Atk SP number input')
    fireEvent.change(numberInput, { target: { value: '20' } })
    expect(onSPChange).toHaveBeenCalledWith(20)
  })

  it('should clamp bar percentage to 100% when value exceeds max', () => {
    render(<StatBar {...defaultProps} value={300} maxValue={200} />)
    const fill = document.querySelector('.stat-bar__fill') as HTMLDivElement
    expect(fill.style.width).toBe('100%')
  })

  it('should render stat bar fill with correct color class', () => {
    render(<StatBar {...defaultProps} />)
    const fill = document.querySelector('.stat-bar__fill')
    expect(fill?.classList.contains('stat-bar__fill--attack')).toBe(true)
  })
})
