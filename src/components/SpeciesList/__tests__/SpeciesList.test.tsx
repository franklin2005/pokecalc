import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SpeciesList } from '../SpeciesList'
import { Generations, toID } from '@smogon/calc'
import { getSpeciesAbilities } from '../../../data/species-abilities'

describe('SpeciesList', () => {
  const gen = Generations.get(9)

  // Build a small species list for testing using iteration (same pattern as SpeciesSelect)
  // Sort alphabetically for consistent ordering in tests
  const speciesList = (() => {
    const targetNames = ['Venusaur', 'Charizard', 'Blastoise', 'Pikachu', 'Gengar']
    const list = [...gen.species]
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
      .filter((s) => targetNames.includes(s.name))
    list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  })()

  const defaultProps = {
    speciesList,
    selectedValue: null as string | null,
    onSelect: vi.fn(),
    onClose: vi.fn(),
  }

  it('should render species items with correct content', () => {
    render(<SpeciesList {...defaultProps} />)
    expect(screen.getByText('Venusaur')).toBeDefined()
    expect(screen.getByText('Charizard')).toBeDefined()
    expect(screen.getByText('Pikachu')).toBeDefined()
  })

  it('should fire onSelect callback when item clicked', () => {
    const onSelect = vi.fn()
    render(<SpeciesList {...defaultProps} onSelect={onSelect} />)
    const item = screen.getByText('Venusaur')
    fireEvent.mouseDown(item.closest('li')!)
    expect(onSelect).toHaveBeenCalledWith('Venusaur')
  })

  it('should fire onClose on Escape key', () => {
    const onClose = vi.fn()
    render(<SpeciesList {...defaultProps} onClose={onClose} />)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should fire onClose on close button click', () => {
    const onClose = vi.fn()
    render(<SpeciesList {...defaultProps} onClose={onClose} />)
    const closeBtn = screen.getByRole('button', { name: /close species list/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should show empty state when no items', () => {
    render(<SpeciesList {...defaultProps} speciesList={[]} />)
    expect(screen.getByText('No Pokémon found')).toBeDefined()
  })

  it('should show individual base stats in separate columns', () => {
    const venusaur = speciesList.find((s) => s.name === 'Venusaur')!
    render(<SpeciesList {...defaultProps} speciesList={[venusaur]} />)
    const bs = venusaur.baseStats
    const itemEl = document.querySelector('.species-list__item')
    const statElements = itemEl!.querySelectorAll('.species-list__col--stat')
    const statValues = Array.from(statElements).map((el) => Number(el.textContent))
    expect(statValues).toEqual([bs.hp, bs.atk, bs.def, bs.spa, bs.spd, bs.spe])
  })

  it('should show BST as sum of all base stats', () => {
    const venusaur = speciesList.find((s) => s.name === 'Venusaur')!
    render(<SpeciesList {...defaultProps} speciesList={[venusaur]} />)
    const bs = venusaur.baseStats
    const expectedBst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe
    const bstEl = document.querySelector('.species-list__item .species-list__col--bst')
    expect(bstEl).toBeDefined()
    expect(Number(bstEl!.textContent)).toBe(expectedBst)
  })

  it('should show common and hidden abilities from species-abilities data', () => {
    const venusaur = speciesList.find((s) => s.name === 'Venusaur')!
    render(<SpeciesList {...defaultProps} speciesList={[venusaur]} />)
    const allAbilities = getSpeciesAbilities(toID(venusaur.name))
    const expectedCommon = allAbilities.length > 1 ? allAbilities.slice(0, -1) : allAbilities
    const expectedHidden = allAbilities.length > 1 ? allAbilities[allAbilities.length - 1] : ''

    const commonEl = document.querySelector('.species-list__item .species-list__col--abilities')
    expect(commonEl).toBeDefined()
    for (const ability of expectedCommon) {
      expect(commonEl!.textContent).toContain(ability)
    }

    const hiddenEl = document.querySelector('.species-list__item .species-list__col--hidden')
    expect(hiddenEl).toBeDefined()
    if (expectedHidden) {
      expect(hiddenEl!.textContent).toContain(expectedHidden)
    } else {
      expect(hiddenEl!.textContent).toBe('\u2014')
    }
  })

  it('should set aria-selected on selected item', () => {
    render(<SpeciesList {...defaultProps} selectedValue="Charizard" />)
    const charizardItem = screen.getByText('Charizard').closest('li')!
    expect(charizardItem.getAttribute('aria-selected')).toBe('true')
  })

  it('should handle arrow key navigation between items', async () => {
    render(<SpeciesList {...defaultProps} />)
    const dialog = screen.getByRole('dialog')

    // Wait for auto-focus to set focusedIndex to 0
    await waitFor(() => {
      const firstItem = screen.getByText('Blastoise').closest('li')!
      expect(firstItem.getAttribute('tabindex')).toBe('0')
    })

    // Arrow down moves to next item
    fireEvent.keyDown(dialog, { key: 'ArrowDown' })

    await waitFor(() => {
      const secondItem = screen.getByText('Charizard').closest('li')!
      expect(secondItem.getAttribute('tabindex')).toBe('0')
      const firstItem = screen.getByText('Blastoise').closest('li')!
      expect(firstItem.getAttribute('tabindex')).toBe('-1')
    })
  })

  it('should select focused item on Enter key', async () => {
    const onSelect = vi.fn()
    render(<SpeciesList {...defaultProps} onSelect={onSelect} />)
    const dialog = screen.getByRole('dialog')

    // Wait for auto-focus, then press Enter
    await waitFor(() => {
      expect(onSelect).not.toHaveBeenCalled()
    })

    // First item (alphabetically sorted) is Blastoise
    fireEvent.keyDown(dialog, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('Blastoise')
  })
})
