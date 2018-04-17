import { Record, List } from 'immutable'
import Range from './Range'
import hoistStatics from '../utils/hoistStatics'

class RangeList extends Record({
  focusedRangeIndex: 0,
  ranges: List.of(Range())
}) {
  static createUnsimplified(args = {}) {
    if ('ranges' in args && args.ranges.size === 0) {
      throw new Error(
        '[RangeList] constructor: The ranges must have a size greater than zero'
      )
    }

    if (
      'focusedRangeIndex' in args &&
      (('ranges' in args &&
        (args.focusedRangeIndex >= args.ranges.size ||
          args.focusedRangeIndex < 0)) ||
        (!('ranges' in args) && args.focusedRangeIndex !== 0))
    ) {
      throw new Error(
        `[RangeList] constructor: The focusedRangeIndex (${
          args.focusedRangeIndex
        }) is either greater than the size of the ranges ${
          'ranges' in args ? `(${args.ranges.size}) ` : ''
        }or less than zero`
      )
    }

    return new RangeList(args)
  }

  static isRangeList(candidate) {
    return !!candidate && candidate.$$model$typeof === '@@__RANGE_LIST__@@'
  }

  $$model$typeof = '@@__RANGE_LIST__@@'

  get rangeCount() {
    return this.ranges.size
  }

  get focusedRange() {
    return this.ranges.get(this.focusedRangeIndex)
  }

  getRange(index) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
    }
    return this.ranges.get(index)
  }

  setFocusedRangeIndex(index) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
    }
    return this.set('focusedRangeIndex', index)
  }

  setRanges(ranges) {
    if (ranges.size === 0) {
      throw new Error(
        '[RangeList] setRanges: The ranges must have a size greater than zero'
      )
    }
    return this.merge({
      ranges,
      focusedRangeIndex: Math.min(this.focusedRangeIndex, ranges.size - 1)
    }).simplify()
  }

  addRange(range) {
    return this.merge({
      ranges: this.ranges.push(range),
      focusedRangeIndex: this.focusedRangeIndex + 1
    }).simplify()
  }

  removeRangeAtIndex(index) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] removeRangeAtIndex: The given index is either less than zero or greater than the amount of ranges'
      )
    }
    if (this.ranges.size === 1) {
      throw new Error(
        '[RangeList] removeRangeAtIndex: Cannot remove the range if there is only one range'
      )
    }
    return this.merge({
      ranges: this.ranges.remove(index),
      focusedRangeIndex:
        index === this.focusedRangeIndex
          ? 0
          : index < this.focusedRangeIndex
            ? this.focusedRangeIndex - 1
            : this.focusedRangeIndex
    })
  }

  removeRange(range) {
    const index = this.getIndexOfRange(range)
    if (this.ranges.size === 1) {
      throw new Error(
        '[RangeList] removeRange: Cannot remove the range if there is currently only one range in total'
      )
    }
    if (index === -1) {
      throw new Error(
        '[RangeList] removeRange: The given range is not one of the current ranges'
      )
    }
    return this.removeRangeAtIndex(index)
  }

  getIndexOfRange(range) {
    return this.ranges.findIndex(other => other.equals(range))
  }

  replaceRangeAtIndex(index, range) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] removeRangeAtIndex: The given index is either less than zero or greater than the amount of ranges'
      )
    }
    return this.setRanges(this.ranges.set(index, range))
  }

  replaceRange(oldRange, newRange) {
    const index = this.getIndexOfRange(oldRange)
    if (index === -1) {
      throw new Error(
        '[RangeList] replaceRange: The given range is not one of the current ranges'
      )
    }
    return this.replaceRangeAtIndex(index, newRange)
  }

  simplify() {
    const result = this.ranges
      .toArray()
      .sort((a, b) => a.firstOffset > b.firstOffset)
    let i = 0

    while (i < result.length - 1) {
      if (result[i].lastOffset >= result[i + 1].firstOffset) {
        result.splice(
          i,
          2,
          result[i].setLastOffset(
            Math.max(result[i].lastOffset, result[i + 1].lastOffset)
          )
        )
      } else {
        i++
      }
    }

    if (result.length === this.ranges.size) {
      return this
    }

    const focusedRangeIndex = result.findIndex(range =>
      range.contains(this.focusedRange)
    )

    if (focusedRangeIndex === -1) {
      throw new Error(
        '[RangeList] simplify: The new focusedRangeIndex is (-1) meaning that no simplified range contains it, which should never happen'
      )
    }

    result[focusedRangeIndex] = result[focusedRangeIndex].setDirection(
      this.focusedRange.direction
    )
    return this.merge({ ranges: List(result), focusedRangeIndex })
  }
}

export default hoistStatics(RangeList, args => {
  return RangeList.createUnsimplified(args).simplify()
})
