import { List } from 'immutable'
import History from '../../src/models/History'

describe('History', () => {
  it('is a function', () => {
    expect(typeof History).toBe('function')
  })

  it('can be called without the new keyword', () => {
    History()
    expect(History().states).toEqual(List())
    expect(History({ states: List.of(1, 2, 3) }).states).toEqual(
      List.of(1, 2, 3)
    )
    expect(
      History({ states: List.of(1, 2, 3), stateIndex: 2 }).stateIndex
    ).toBe(2)
  })

  it('can be called with the new keyword', () => {
    new History()
    expect(new History().states).toEqual(List())
    expect(new History({ states: List.of(1, 2, 3) }).states).toEqual(
      List.of(1, 2, 3)
    )
    expect(
      new History({ states: List.of(1, 2, 3), stateIndex: 2 }).stateIndex
    ).toBe(2)
  })

  describe('static isHistory', () => {
    it('is a function', () => {
      expect(typeof History.isHistory).toBe('function')
    })

    it('checks if the arguments is a History object', () => {
      expect(History.isHistory(new History())).toBe(true)
      expect(History.isHistory(History())).toBe(true)
      expect(History.isHistory()).toBe(false)
      expect(History.isHistory(History)).toBe(false)
      expect(History.isHistory({})).toBe(false)
    })
  })

  describe('states', () => {
    it('defaults to an empty list', () => {
      expect(History().states).toEqual(List())
    })

    it('can be overriden', () => {
      const states = List.of(2, 3)
      expect(History({ states }).states).toBe(states)
    })
  })

  it('throws when the states is empty and the state index is not null', () => {
    expect(() => History({ states: List(), stateIndex: 0 })).toThrow(
      '[History] constructor: if states is empty the stateIndex must be null'
    )
    expect(() => History({ stateIndex: 'foo' })).toThrow(
      '[History] constructor: if states is empty the stateIndex must be null'
    )
    History({ stateIndex: null })
    History({ states: List(), stateIndex: null })
  })

  it('throws when the state index is out of bounds', () => {
    expect(() => History({ states: List.of(2, 3), stateIndex: -1 })).toThrow(
      '[History] constructor: the stateIndex (-1) must be greater than zero and less than the amount of states (2)'
    )
    expect(() => History({ states: List.of(2, 3), stateIndex: 2 })).toThrow(
      '[History] constructor: the stateIndex (2) must be greater than zero and less than the amount of states (2)'
    )
    History({ states: List.of(1, 2, 3), stateIndex: 2 })
    History({ states: List.of(1), stateIndex: 0 })
  })

  it('throws when the states have a size greater than zero and the stateIndex is null', () => {
    expect(() =>
      History({ states: List.of(1, 2, 3), stateIndex: null })
    ).toThrow(
      '[History] constructor: if the states is not empty the stateIndex cannot be null'
    )
    expect(() => History({ states: List.of(1), stateIndex: null })).toThrow(
      '[History] constructor: if the states is not empty the stateIndex cannot be null'
    )
    History({ states: List.of(1, 2, 3), stateIndex: 2 })
    History({ states: List.of(1), stateIndex: 0 })
  })

  describe('stateIndex', () => {
    it('defaults to null if there are no states', () => {
      expect(History().stateIndex).toBe(null)
    })

    it('defaults to the amount of states if not specified', () => {
      expect(History({ states: List.of(2) }).stateIndex).toBe(0)
      expect(History({ states: List.of(3, 4, 5) }).push(4).stateIndex).toBe(3)
    })
  })

  describe('currentState', () => {
    it('returns the current state', () => {
      expect(History().currentState).toBe(null)
      expect(History({ states: List.of(1, 2, 3, 4) }).currentState).toBe(4)
      expect(
        History({ states: List.of(1, 2, 3, 4), stateIndex: 2 }).currentState
      ).toBe(3)
      expect(
        History({ states: List.of('first', 'second', 'third', 'fourth') })
          .pop()
          .pop()
          .pop().currentState
      ).toBe('first')
    })
  })

  describe('amountOfStates', () => {
    it('returns the amount of states', () => {
      expect(History().amountOfStates).toBe(0)
      expect(History({ states: List.of(2, 3, 4) }).amountOfStates).toBe(3)
      expect(
        History({ states: List.of(3, 4) })
          .push(4)
          .pop().amountOfStates
      ).toBe(3)
    })
  })

  describe('hasNoStates', () => {
    it('is false if has states', () => {
      expect(History({ states: List.of(2) }).hasNoStates).toBe(false)
      expect(History({ states: List.of(2), stateIndex: 0 }).hasNoStates).toBe(
        false
      )
      expect(History({ states: List() }).push(2).hasNoStates).toBe(false)
    })

    it('is true if has no states', () => {
      expect(History().hasNoStates).toBe(true)
      expect(History({ states: List() }).hasNoStates).toBe(true)
    })
  })

  describe('isAtLastState', () => {
    it('is true if has no states', () => {
      expect(History().isAtLastState).toBe(true)
      expect(History({ states: List() }).isAtLastState).toBe(true)
    })

    it('is true if has states and is at last state', () => {
      expect(History({ states: List.of(2) }).isAtLastState).toBe(true)
      expect(
        History({ states: List.of(2, 3) })
          .push(4)
          .setStateIndex(1)
          .push(3).isAtLastState
      ).toBe(true)
    })

    it('is false if is not at last state', () => {
      expect(
        History({ states: List.of(2, 3) })
          .push(4)
          .pop().isAtLastState
      ).toBe(false)
      expect(
        History({ states: List.of(1, 2, 3, 4), stateIndex: 1 }).isAtLastState
      ).toBe(false)
      expect(
        History({ states: List.of(2, 3) })
          .push(4)
          .setStateIndex(0).isAtLastState
      ).toBe(false)
    })
  })

  describe('setStates', () => {
    it('updates the states', () => {
      expect(History().setStates(List.of(2, 3)).states).toEqual(List.of(2, 3))
      expect(
        History({ states: List.of(2, 3) })
          .pop()
          .setStates(List.of(3, 4)).states
      ).toEqual(List.of(3, 4))
    })

    it('sets the stateIndex to null if there are no states', () => {
      expect(
        History({ states: List.of(2, 3) }).setStates(List()).stateIndex
      ).toBe(null)
      expect(
        History()
          .push(4)
          .setStates(List()).stateIndex
      ).toBe(null)
    })

    it('constrains the stateIndex between 0 and the amount of new states', () => {
      expect(
        History({ states: List.of(1, 2) })
          .push(3)
          .setStates(List.of(1, 2)).stateIndex
      ).toBe(1)
      expect(
        History()
          .push(1)
          .push(2)
          .push(3)
          .setStateIndex(1)
          .setStates(List.of(1)).stateIndex
      ).toBe(0)
    })
  })

  describe('setStateIndex', () => {
    it('throws when the states are empty and the stateIndex is not null', () => {
      expect(() => History().setStateIndex(2)).toThrow(
        '[History] setStateIndex: if the current states is empty the new stateIndex must be null'
      )
      History().setStateIndex(null)
    })

    it('throws when the new stateIndex is out of bounds', () => {
      expect(() => History({ states: List.of(2, 3) }).setStateIndex(2)).toThrow(
        '[History] setStateIndex: the given stateIndex is out of bounds (either greater than the amountOfStates or less than zero)'
      )
      expect(() => History({ states: List.of(2) }).setStateIndex(-1)).toThrow(
        '[History] setStateIndex: the given stateIndex is out of bounds (either greater than the amountOfStates or less than zero)'
      )
    })

    it('sets the state index to the one given', () => {
      expect(
        History()
          .push(4)
          .setStateIndex(0).stateIndex
      ).toBe(0)
      expect(
        History({ states: List.of(2, 3, 4) }).setStateIndex(1).stateIndex
      ).toBe(1)
      expect(
        History({
          states: List.of(1, 2, 3, 4, 5),
          stateIndex: 3
        }).setStateIndex(0).stateIndex
      ).toBe(0)
    })
  })

  describe('push', () => {
    it('pushes onto the current stack', () => {
      expect(History().push(2).states).toEqual(List.of(2))
      expect(History({ states: List.of(1, 2) }).push(3).states).toEqual(
        List.of(1, 2, 3)
      )
    })

    it('removes all the states after the current stateIndex', () => {
      expect(
        History({ states: List.of(1, 2), stateIndex: 0 }).push(3).states
      ).toEqual(List.of(1, 3))
      expect(
        History({ states: List.of(1, 2, 3, 4, 5, 6), stateIndex: 2 }).push(7)
          .states
      ).toEqual(List.of(1, 2, 3, 7))
    })

    it('increments the stateIndex', () => {
      expect(History().push(2).stateIndex).toBe(0)
      expect(
        History()
          .push(1)
          .push(2).stateIndex
      ).toBe(1)
      expect(
        History({ states: List.of(1, 2, 3, 4, 5), stateIndex: 2 }).push(6)
          .stateIndex
      ).toBe(3)
    })
  })

  describe('pop', () => {
    it('returns itself if is at the first state', () => {
      const assertWorks = history => expect(history.pop()).toBe(history)
      assertWorks(History())
      assertWorks(History({ states: List.of(1) }))
      assertWorks(History({ states: List.of(1, 2, 3, 4), stateIndex: 0 }))
    })

    it('decrements the stateIndex by one if is not at first state', () => {
      const assertWorks = history =>
        expect(history.pop().stateIndex).toBe(history.stateIndex - 1)
      assertWorks(History({ states: List.of(1) }).push(2))
      assertWorks(History({ states: List.of(1, 2, 3, 4), stateIndex: 3 }))
      assertWorks(History({ states: List.of(1, 2, 3), stateIndex: 1 }))
    })
  })
})
