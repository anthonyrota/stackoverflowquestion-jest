import { Record, List } from 'immutable'
import hoistStatics from '../utils/hoistStatics'

class History extends Record({
  states: List(),
  stateIndex: null
}) {
  static isHistory(candidate) {
    return !!(candidate && candidate.$$model$typeof === '@@__HISTORY__@@')
  }

  $$model$typeof = '@@__HISTORY__@@'

  get currentState() {
    return this.stateIndex === null ? null : this.states.get(this.stateIndex)
  }

  get amountOfStates() {
    return this.states.size
  }

  get hasNoStates() {
    return this.amountOfStates === 0
  }

  get isAtLastState() {
    return this.hasNoStates || this.stateIndex === this.amountOfStates - 1
  }

  get isAtFirstState() {
    return this.amountOfStates === 0 || this.stateIndex === 0
  }

  setStates(states) {
    return this.merge({
      states,
      stateIndex:
        states.size === 0
          ? null
          : Math.min(this.stateIndex || 0, states.size - 1)
    })
  }

  setStateIndex(stateIndex) {
    if (this.amountOfStates === 0 && stateIndex !== null) {
      throw new Error(
        '[History] setStateIndex: if the current states is empty the new stateIndex must be null'
      )
    }

    if (
      this.amountOfStates > 0 &&
      (stateIndex >= this.amountOfStates || stateIndex < 0)
    ) {
      throw new Error(
        '[History] setStateIndex: the given stateIndex is out of bounds (either greater than the amountOfStates or less than zero)'
      )
    }

    return this.set('stateIndex', stateIndex)
  }

  push(state) {
    return this.merge({
      states: this.isAtLastState
        ? this.states.push(state)
        : this.states.setSize(this.stateIndex + 1).push(state),
      stateIndex: this.stateIndex === null ? 0 : this.stateIndex + 1
    })
  }

  pop() {
    return this.isAtFirstState ? this : this.setStateIndex(this.stateIndex - 1)
  }
}

export default hoistStatics(History, (args = {}) => {
  if (
    (!('states' in args) || args.states.size === 0) &&
    'stateIndex' in args &&
    args.stateIndex !== null
  ) {
    throw new Error(
      '[History] constructor: if states is empty the stateIndex must be null'
    )
  }

  if (
    'states' in args &&
    'stateIndex' in args &&
    args.states.size > 0 &&
    args.stateIndex === null
  ) {
    throw new Error(
      '[History] constructor: if the states is not empty the stateIndex cannot be null'
    )
  }

  if (
    'states' in args &&
    'stateIndex' in args &&
    args.stateIndex !== null &&
    (args.stateIndex < 0 || args.stateIndex >= args.states.size)
  ) {
    throw new Error(
      `[History] constructor: the stateIndex (${
        args.stateIndex
      }) must be greater than zero and less than the amount of states (${
        args.states.size
      })`
    )
  }

  if (args.states && args.states.size === 0) {
    return new History({
      states: args.states,
      stateIndex: null
    })
  } else if (args.states && args.states.size > 0 && !('stateIndex' in args)) {
    return new History({
      states: args.states,
      stateIndex: args.states.size - 1
    })
  } else {
    return new History(args)
  }
})
