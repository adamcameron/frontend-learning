import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useState, useEffect, type MouseEvent, type ReactElement } from 'react'
import { useImmer } from 'use-immer'

describe('State tests', () => {
  it('tests that I can define & render components within a test', async () => {
    function TestContainer() {
      return <div data-testid="c1" />
    }
    render(<TestContainer data-testid="c1" />)

    await waitFor(() => screen.getByTestId('c1'))
  })

  it('tests waitFor timeout', async () => {
    const delay = 500

    function SlowTestContainer() {
      const [isShown, setIsShown] = useState(false)
      useEffect(() => {
        const timer = setTimeout(() => {
          setIsShown(true)
        }, delay)
        return () => clearTimeout(timer)
      })
      return isShown ? <div data-testid="c2" /> : null
    }

    render(<SlowTestContainer data-testid="c2" />)

    await expect(async () => {
      await waitFor(() => screen.getByTestId('c2'), { timeout: delay / 2 })
    }).rejects.toThrowError('Unable to find an element')
  })

  it("demonstrates consecutive sets to state with literal doesn't work as expected", async () => {
    function TestButton() {
      const [count, setCount] = useState(0)
      function clickHandler(e: MouseEvent<HTMLElement>) {
        setCount(count + 1)
        setCount(count + 1)
        setCount(count + 1)
        console.log(`The count is: [${count}]`)
        e.stopPropagation()
      }

      return <button data-testid="b1" onClick={clickHandler} />
    }

    const consoleSpy = vi.spyOn(console, 'log')
    consoleSpy.mockImplementation(() => {})

    render(<TestButton data-testid="b1" />)

    await waitFor(() => {
      const container = screen.getByTestId('b1')
      fireEvent.click(container)
      fireEvent.click(container)
    })
    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenCalledWith('The count is: [0]')
    expect(consoleSpy).not.toHaveBeenCalledWith('The count is: [3]') // each setCount() acts on same count value...
    expect(consoleSpy).toHaveBeenCalledWith('The count is: [1]') // ...so the value is only incremented once
  })

  it('demonstrates consecutive sets to state with callback does work as expected', async () => {
    function TestButton() {
      const [count, setCount] = useState(0)
      function clickHandler(e: MouseEvent<HTMLElement>) {
        setCount((n) => n + 1)
        setCount((n) => n + 1)
        setCount((n) => n + 1)
        console.log(`The count is: [${count}]`)
        e.stopPropagation()
      }

      return <button data-testid="b2" onClick={clickHandler} />
    }

    const consoleSpy = vi.spyOn(console, 'log')
    consoleSpy.mockImplementation(() => {})

    render(<TestButton data-testid="b2" />)

    await waitFor(() => {
      const container = screen.getByTestId('b2')
      fireEvent.click(container)
      fireEvent.click(container)
    })
    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenCalledWith('The count is: [0]') // initial render
    expect(consoleSpy).toHaveBeenCalledWith('The count is: [3]') // after re-render due to first click's setCount calls
  })

  it("demonstrates that 'sub-object' are discrete objects unto themselves", () => {
    const personnelRecord = {
      id: 1,
      person: {
        given: 'Zachary',
        family: 'Lynch',
      },
    }
    const referenceToNameToFix = personnelRecord.person
    referenceToNameToFix.family = 'Cameron Lynch'

    expect(personnelRecord.person.family).toBe('Cameron Lynch')
  })
  describe('Updating state object tests', () => {
    type nullableString = string | null
    type nullableNumber = number | null
    type record = {
      id: nullableNumber
      person: { given: nullableString; family: nullableString }
    }
    const nullRecord: record = {
      id: null,
      person: {
        given: null,
        family: null,
      },
    }

    async function exerciseComponent(component: ReactElement) {
      const id = (component.props as { 'data-testid': number })['data-testid']
      render(component)
      await waitFor(() => {
        const container = screen.getByTestId(id)
        fireEvent.click(container.querySelector('#log')!)
        fireEvent.click(container.querySelector('#initialise')!)
        fireEvent.click(container.querySelector('#log')!)

        fireEvent.click(container.querySelector('#fix')!)
        fireEvent.click(container.querySelector('#log')!)
      })
    }

    expect.extend({
      toUpdateStateCorrectly(consoleSpy) {
        expect(consoleSpy).toHaveBeenCalledTimes(3)
        expect(consoleSpy).toHaveBeenNthCalledWith(1, {
          id: null,
          person: { given: null, family: null },
        })
        expect(consoleSpy).toHaveBeenNthCalledWith(2, {
          id: 1,
          person: { given: 'Zachary', family: 'Lynch' },
        })
        expect(consoleSpy).toHaveBeenNthCalledWith(3, {
          id: 1,
          person: { given: 'Zachary', family: 'Cameron Lynch' },
        })
        return {
          pass: true,
          message: () => 'State updated correctly',
        }
      },
    })

    it('demonstrates updating state objects the long way', async () => {
      function PersonnelRecord() {
        const [personnelRecord, setPersonnelRecord] = useState(nullRecord)
        function initialise() {
          setPersonnelRecord({
            id: 1,
            person: { given: 'Zachary', family: 'Lynch' },
          })
        }
        function fix() {
          setPersonnelRecord({
            ...personnelRecord,
            person: {
              ...personnelRecord.person,
              family: 'Cameron Lynch',
            },
          })
        }
        function log() {
          console.log(personnelRecord)
        }
        return (
          <div data-testid="r1">
            <button onClick={initialise} id="initialise">
              Initialise
            </button>
            <button onClick={fix} id="fix">
              Fix
            </button>
            <button onClick={log} id="log">
              Log
            </button>
          </div>
        )
      }
      const consoleSpy = vi.spyOn(console, 'log')
      consoleSpy.mockImplementation(() => {})

      await exerciseComponent(<PersonnelRecord data-testid="r1" />)
      expect(consoleSpy).toUpdateStateCorrectly()
    })

    it('demonstrates updating state objects using immer', async () => {
      function PersonnelRecord() {
        const [personnelRecord, updatePersonnelRecord] = useImmer(nullRecord)
        function initialise() {
          updatePersonnelRecord({
            id: 1,
            person: { given: 'Zachary', family: 'Lynch' },
          })
        }
        function fix() {
          updatePersonnelRecord((draft) => {
            draft.person.family = 'Cameron Lynch'
          })
        }
        function log() {
          console.log(personnelRecord)
        }

        return (
          <div data-testid="r2">
            <button onClick={initialise} id="initialise">
              Initialise
            </button>
            <button onClick={fix} id="fix">
              Fix
            </button>
            <button onClick={log} id="log">
              Log
            </button>
          </div>
        )
      }
      const consoleSpy = vi.spyOn(console, 'log')
      consoleSpy.mockImplementation(() => {})

      await exerciseComponent(<PersonnelRecord data-testid="r2" />)
      expect(consoleSpy).toUpdateStateCorrectly()
    })
  })
})
