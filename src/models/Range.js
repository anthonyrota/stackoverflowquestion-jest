import { Record } from 'immutable'
import hoistStatics from '../utils/hoistStatics'

class Range extends Record({ anchorOffset: 0, focusOffset: 0 }) {
  static isRange(candidate) {
    return !!(candidate && candidate.$$model$typeof === '@@__RANGE__@@')
  }

  $$model$typeof = '@@__RANGE__@@'

  get isCollapsed() {
    return this.anchorOffset === this.focusOffset
  }

  get isExpanded() {
    return !this.isCollapsed
  }

  get isBackwards() {
    return this.anchorOffset > this.focusOffset
  }

  get isForwards() {
    return !this.isBackwards
  }

  get firstOffset() {
    return Math.min(this.anchorOffset, this.focusOffset)
  }

  get lastOffset() {
    return Math.max(this.anchorOffset, this.focusOffset)
  }

  get direction() {
    return this.isForwards ? 'forwards' : 'backwards'
  }

  contains(other) {
    return (
      other.firstOffset >= this.firstOffset &&
      other.lastOffset <= this.lastOffset
    )
  }

  mergeWithRange(other) {
    if (this.contains(other)) {
      return this
    }
    if (other.contains(this)) {
      return other
    }
    if (!this.touches(other)) {
      throw new Error(
        '[Range] mergeWithRange: Neither range touches eachother and so the ranges cannot merge together'
      )
    }
    if (this.isForwards) {
      return this.merge({
        anchorOffset: Math.min(this.firstOffset, other.firstOffset),
        focusOffset: Math.max(this.lastOffset, other.lastOffset)
      })
    }
    return this.merge({
      anchorOffset: Math.max(this.lastOffset, other.lastOffset),
      focusOffset: Math.min(this.firstOffset, other.firstOffset)
    })
  }

  touches(other) {
    return (
      (this.firstOffset >= other.firstOffset &&
        this.firstOffset <= other.lastOffset) ||
      (this.lastOffset >= other.firstOffset &&
        this.lastOffset <= other.lastOffset) ||
      (other.firstOffset >= this.firstOffset &&
        other.firstOffset <= this.lastOffset) ||
      (other.lastOffset >= this.firstOffset &&
        other.lastOffset <= this.lastOffset)
    )
  }

  flip() {
    return this.merge({
      anchorOffset: this.focusOffset,
      focusOffset: this.anchorOffset
    })
  }

  setBackwards() {
    return this.isBackwards ? this : this.flip()
  }

  setForwards() {
    return this.isForwards ? this : this.flip()
  }

  setDirection(direction) {
    if (direction !== 'forwards' && direction !== 'backwards') {
      throw new Error(
        `[Range] setDirection: The direction specified is not 'forwards' or 'backwards'`
      )
    }

    return direction === 'forwards' ? this.setForwards() : this.setBackwards()
  }

  setAnchorOffset(newOffset) {
    return this.set('anchorOffset', newOffset)
  }

  setFocusOffset(newOffset) {
    return this.set('focusOffset', newOffset)
  }

  setFirstOffset(newOffset) {
    return this.anchorOffset < this.focusOffset
      ? this.setAnchorOffset(newOffset)
      : this.setFocusOffset(newOffset)
  }

  setLastOffset(newOffset) {
    return this.anchorOffset > this.focusOffset
      ? this.setAnchorOffset(newOffset)
      : this.setFocusOffset(newOffset)
  }

  moveAnchorOffset(amount) {
    return this.setAnchorOffset(this.anchorOffset + amount)
  }

  moveFocusOffset(amount) {
    return this.setFocusOffset(this.focusOffset + amount)
  }

  moveFirstOffset(amount) {
    return this.setFirstOffset(this.firstOffset + amount)
  }

  moveLastOffset(amount) {
    return this.setLastOffset(this.lastOffset + amount)
  }

  collapseAnchor() {
    return this.setFocusOffset(this.anchorOffset)
  }

  collapseFocus() {
    return this.setAnchorOffset(this.focusOffset)
  }

  collapseBackwards() {
    return this.setBackwards().collapseFocus()
  }

  collapseForwards() {
    return this.setForwards().collapseFocus()
  }
}

export default hoistStatics(Range, (args = {}) => {
  if ('anchorOffset' in args && typeof args.anchorOffset !== 'number') {
    throw new Error('[Range] constructor: the anchorOffset must be a number')
  }

  if ('focusOffset' in args && typeof args.focusOffset !== 'number') {
    throw new Error('[Range] constructor: the focusOffset must be a number')
  }

  if ('anchorOffset' in args && Number.isNaN(args.anchorOffset)) {
    throw new Error('[Range] constructor: the anchorOffset cannot be NaN')
  }

  if ('focusOffset' in args && Number.isNaN(args.focusOffset)) {
    throw new Error('[Range] constructor: the focusOffset cannot be NaN')
  }

  return new Range(args)
})
