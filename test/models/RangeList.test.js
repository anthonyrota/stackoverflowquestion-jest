import { List } from 'immutable'
import RangeList from '../../src/models/RangeList'
import Range from '../../src/models/Range'

describe('RangeList', () => {
  it('is a function', () => {
    expect(typeof RangeList).toBe('function')
  })

  it('can be called without the new keyword', () => {
    RangeList()
    expect('focusedRangeIndex' in RangeList()).toBe(true)
    expect('ranges' in RangeList()).toBe(true)
  })

  it('can be called with the new keyword', () => {
    new RangeList()
    expect('focusedRangeIndex' in new RangeList()).toBe(true)
    expect('ranges' in new RangeList()).toBe(true)
  })

  describe('static isRangeList', () => {
    it('is a function', () => {
      expect(RangeList.isRangeList(new RangeList())).toBe(true)
      expect(RangeList.isRangeList(RangeList())).toBe(true)
      expect(RangeList.isRangeList()).toBe(false)
      expect(RangeList.isRangeList(RangeList)).toBe(false)
      expect(RangeList.isRangeList({})).toBe(false)
    })
  })

  describe('focusedRangeIndex', () => {
    it('defaults to zero', () => {
      expect(RangeList().focusedRangeIndex).toBe(0)
    })

    it('can be overriden', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).focusedRangeIndex
      ).toBe(1)
    })

    it('throws when is out of bounds', () => {
      expect(() => RangeList({ focusedRangeIndex: 3 })).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (3) is either greater than the size of the ranges or less than zero'
      )
      expect(() => RangeList({ focusedRangeIndex: -1 })).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (-1) is either greater than the size of the ranges or less than zero'
      )
      expect(() =>
        RangeList({ focusedRangeIndex: 3, ranges: List.of(Range()) })
      ).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (3) is either greater than the size of the ranges (1) or less than zero'
      )
      expect(() =>
        RangeList({
          focusedRangeIndex: -1,
          ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
        })
      ).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (-1) is either greater than the size of the ranges (2) or less than zero'
      )
      RangeList({ focusedRangeIndex: 0 })
      RangeList({ focusedRangeIndex: 0, ranges: List.of(Range()) })
      RangeList({
        focusedRangeIndex: 2,
        ranges: List.of(
          Range(),
          Range({ anchorOffset: 1, focusOffset: 1 }),
          Range({ anchorOffset: 2, focusOffset: 2 }),
          Range({ anchorOffset: 3, focusOffset: 3 })
        )
      })
    })
  })

  describe('ranges', () => {
    it('defaults to a list with one range in it', () => {
      expect(RangeList().ranges).toEqual(List.of(Range()))
    })

    it('can be overriden', () => {
      const ranges = List.of(
        Range(),
        Range({ anchorOffset: 1, focusOffset: 1 }),
        Range({ anchorOffset: 2, focusOffset: 2 })
      )
      expect(RangeList({ ranges }).ranges).toBe(ranges)
    })

    it('throws when the ranges are empty', () => {
      expect(() => RangeList({ ranges: List() })).toThrow(
        '[RangeList] constructor: The ranges must have a size greater than zero'
      )
      RangeList({ ranges: List.of(Range()) })
    })
  })

  describe('rangeCount', () => {
    it('returns the size of the ranges', () => {
      expect(RangeList().rangeCount).toBe(1)
      expect(
        RangeList({
          ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
        }).rangeCount
      ).toBe(2)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          )
        }).rangeCount
      ).toBe(3)
    })
  })

  describe('focusedRange', () => {
    it('returns the currently focused range', () => {
      let r = RangeList()
      expect(r.focusedRange).toEqual(r.getRange(0))
      r = RangeList({
        ranges: List.of(
          Range(),
          Range({ anchorOffset: 1, focusOffset: 1 }),
          Range({ anchorOffset: 2, focusOffset: 2 })
        )
      })
      expect(r.focusedRange).toEqual(r.getRange(0))
      r = RangeList({
        ranges: List.of(
          Range(),
          Range({ anchorOffset: 1, focusOffset: 1 }),
          Range({ anchorOffset: 2, focusOffset: 2 }),
          Range({ anchorOffset: 3, focusOffset: 3 })
        ),
        focusedRangeIndex: 2
      })
      expect(r.focusedRange).toEqual(r.getRange(2))
      r = RangeList({
        ranges: List.of(
          Range(),
          Range({ anchorOffset: 1, focusOffset: 1 }),
          Range({ anchorOffset: 2, focusOffset: 2 }),
          Range({ anchorOffset: 3, focusOffset: 3 })
        ),
        focusedRangeIndex: 3
      })
      expect(r.focusedRange).toEqual(r.getRange(3))
    })
  })

  describe('getRange', () => {
    const r1 = Range()
    const r2 = Range({ anchorOffset: 1, focusOffset: 1 })
    const r3 = Range({ anchorOffset: 2, focusOffset: 2 })
    const r4 = Range({ anchorOffset: 3, focusOffset: 3 })
    const ranges1 = List.of(r1)
    const ranges2 = List.of(r1, r2, r3, r4)
    const rangeList1 = RangeList({ ranges: ranges1 })
    const rangeList2 = RangeList({ ranges: ranges2 })

    it('returns the range at the given index', () => {
      expect(RangeList().getRange(0)).toEqual(Range())
      expect(rangeList1.getRange(0)).toBe(r1)
      expect(rangeList2.getRange(0)).toBe(r1)
      expect(rangeList2.getRange(1)).toBe(r2)
      expect(rangeList2.getRange(2)).toBe(r3)
      expect(rangeList2.getRange(3)).toBe(r4)
    })

    it('throws when an invalid index is given', () => {
      expect(() => rangeList1.getRange(-1)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.getRange(1)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.getRange(8)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(-5)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(-1)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(4)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(7)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
    })
  })

  describe('setFocusedRangeIndex', () => {
    const rangeList1 = RangeList({ ranges: List.of(Range()) })
    const rangeList2 = RangeList({
      ranges: List.of(
        Range(),
        Range({ anchorOffset: 1, focusOffset: 1 }),
        Range({ anchorOffset: 2, focusOffset: 2 }),
        Range({ anchorOffset: 3, focusOffset: 3 })
      )
    })

    it('sets the focused range index to the one given', () => {
      expect(RangeList().setFocusedRangeIndex(0).focusedRangeIndex).toBe(0)
      expect(rangeList1.setFocusedRangeIndex(0).focusedRangeIndex).toBe(0)
      expect(rangeList2.setFocusedRangeIndex(0).focusedRangeIndex).toBe(0)
      expect(rangeList2.setFocusedRangeIndex(1).focusedRangeIndex).toBe(1)
      expect(rangeList2.setFocusedRangeIndex(2).focusedRangeIndex).toBe(2)
      expect(rangeList2.setFocusedRangeIndex(3).focusedRangeIndex).toBe(3)
    })

    it('throws when an invalid index is given', () => {
      expect(() => rangeList1.setFocusedRangeIndex(-1)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.setFocusedRangeIndex(1)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.setFocusedRangeIndex(8)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(-5)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(-1)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(4)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(7)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
    })
  })

  describe('setRanges', () => {
    const r0 = List()
    const r1 = List.of(Range())
    const r2 = List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
    const r3 = List.of(
      Range(),
      Range({ anchorOffset: 2, focusOffset: 2 }),
      Range({ anchorOffset: 3, focusOffset: 3 })
    )
    const rl1 = RangeList({ ranges: List.of(Range()) })
    const rl2 = RangeList({
      ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
    })
    const rl3 = RangeList({
      ranges: List.of(
        Range(),
        Range({ anchorOffset: 1, focusOffset: 1 }),
        Range({ anchorOffset: 2, focusOffset: 2 })
      )
    })

    it('updates the current ranges', () => {
      expect(rl1.setRanges(r1).ranges).toBe(r1)
      expect(rl2.setRanges(r1).ranges).toBe(r1)
      expect(rl3.setRanges(r1).ranges).toBe(r1)
      expect(rl1.setRanges(r2).ranges).toBe(r2)
      expect(rl2.setRanges(r2).ranges).toBe(r2)
      expect(rl3.setRanges(r2).ranges).toBe(r2)
      expect(rl1.setRanges(r3).ranges).toBe(r3)
      expect(rl2.setRanges(r3).ranges).toBe(r3)
      expect(rl3.setRanges(r3).ranges).toBe(r3)
    })

    it('throws when the ranges are empty', () => {
      expect(() => rl1.setRanges(r0)).toThrow(
        '[RangeList] setRanges: The ranges must have a size greater than zero'
      )
      expect(() => rl2.setRanges(r0)).toThrow(
        '[RangeList] setRanges: The ranges must have a size greater than zero'
      )
      expect(() => rl3.setRanges(r0)).toThrow(
        '[RangeList] setRanges: The ranges must have a size greater than zero'
      )
    })

    it("keeps the focused range index the same if there aren't less ranges than before", () => {
      expect(rl1.setFocusedRangeIndex(0).setRanges(r1).focusedRangeIndex).toBe(
        0
      )
      expect(rl2.setFocusedRangeIndex(0).setRanges(r2).focusedRangeIndex).toBe(
        0
      )
      expect(rl2.setFocusedRangeIndex(1).setRanges(r2).focusedRangeIndex).toBe(
        1
      )
      expect(rl3.setFocusedRangeIndex(0).setRanges(r3).focusedRangeIndex).toBe(
        0
      )
      expect(rl3.setFocusedRangeIndex(1).setRanges(r2).focusedRangeIndex).toBe(
        1
      )
      expect(rl3.setFocusedRangeIndex(2).setRanges(r3).focusedRangeIndex).toBe(
        2
      )
    })

    it('caps the focused range index if there are less ranges than before', () => {
      expect(rl2.setFocusedRangeIndex(1).setRanges(r1).focusedRangeIndex).toBe(
        0
      )
      expect(rl3.setFocusedRangeIndex(1).setRanges(r1).focusedRangeIndex).toBe(
        0
      )
      expect(rl3.setFocusedRangeIndex(2).setRanges(r1).focusedRangeIndex).toBe(
        0
      )
      expect(rl3.setFocusedRangeIndex(2).setRanges(r2).focusedRangeIndex).toBe(
        1
      )
    })
  })

  describe('addRange', () => {
    it('adds the new range to the current ranges', () => {
      expect(
        RangeList().addRange(Range({ anchorOffset: 1, focusOffset: 1 })).ranges
      ).toEqual(List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 })))
      expect(
        RangeList({
          ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
        }).addRange(Range({ anchorOffset: 3, focusOffset: 3 })).ranges
      ).toEqual(
        List.of(
          Range(),
          Range({ anchorOffset: 1, focusOffset: 1 }),
          Range({ anchorOffset: 3, focusOffset: 3 })
        )
      )
    })

    it('increments the focused range index', () => {
      expect(
        RangeList().addRange(Range({ anchorOffset: 1, focusOffset: 1 }))
          .focusedRangeIndex
      ).toBe(1)
      expect(
        RangeList({
          ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
        }).addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .focusedRangeIndex
      ).toBe(1)
    })
  })

  describe('removeRangeAtIndex', () => {
    it('throws when the index is out of range', () => {
      expect(() =>
        RangeList()
          .addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .removeRangeAtIndex(-1)
      ).toThrow(
        '[RangeList] removeRangeAtIndex: The given index is either less than zero or greater than the amount of ranges'
      )
      expect(() =>
        RangeList()
          .addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .removeRangeAtIndex(2)
      ).toThrow(
        '[RangeList] removeRangeAtIndex: The given index is either less than zero or greater than the amount of ranges'
      )
      expect(() =>
        RangeList()
          .addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .addRange(Range({ anchorOffset: 1, focusOffset: 1 }))
          .removeRangeAtIndex(7)
      ).toThrow(
        '[RangeList] removeRangeAtIndex: The given index is either less than zero or greater than the amount of ranges'
      )
    })

    it('throws when the only range is being removed', () => {
      expect(() => RangeList().removeRangeAtIndex(0)).toThrow(
        '[RangeList] removeRangeAtIndex: Cannot remove the range if there is only one range'
      )
    })

    it('removes the range', () => {
      expect(
        RangeList()
          .addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .removeRangeAtIndex(0).ranges
      ).toEqual(List.of(Range({ anchorOffset: 3, focusOffset: 3 })))
      expect(
        RangeList()
          .addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .removeRangeAtIndex(1).ranges
      ).toEqual(List.of(Range()))
      expect(
        RangeList()
          .addRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .addRange(Range({ anchorOffset: 1, focusOffset: 1 }))
          .removeRangeAtIndex(1).ranges
      ).toEqual(List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 })))
    })

    it('sets the focused range index to zero when the focused range is being removed', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          )
        }).removeRangeAtIndex(2).focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).removeRangeAtIndex(1).focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 3
        }).removeRangeAtIndex(3).focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 2
        }).removeRangeAtIndex(2).focusedRangeIndex
      ).toBe(0)
    })

    it('decrements the focused range index when the given index is less than the current focused range index', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 2
        }).removeRangeAtIndex(1).focusedRangeIndex
      ).toBe(1)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).removeRangeAtIndex(0).focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 3
        }).removeRangeAtIndex(1).focusedRangeIndex
      ).toBe(2)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 2
        }).removeRangeAtIndex(0).focusedRangeIndex
      ).toBe(1)
    })

    it('retains the focused range index when the given index is greater than the current focused range index', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 0
        }).removeRangeAtIndex(2).focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).removeRangeAtIndex(2).focusedRangeIndex
      ).toBe(1)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 2
        }).removeRangeAtIndex(3).focusedRangeIndex
      ).toBe(2)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 0
        }).removeRangeAtIndex(2).focusedRangeIndex
      ).toBe(0)
    })
  })

  describe('getIndexOfRange', () => {
    it('returns (-1) if the given range is not part of the current ranges', () => {
      expect(
        RangeList().getIndexOfRange(Range({ anchorOffset: 1, focusOffset: 1 }))
      ).toBe(-1)
      expect(
        RangeList().getIndexOfRange(Range({ anchorOffset: 1, focusOffset: 4 }))
      ).toBe(-1)
      expect(
        RangeList({
          ranges: List.of(Range({ anchorOffset: 2, focusOffset: 2 }))
        }).getIndexOfRange(Range({ anchorOffset: 1, focusOffset: 1 }))
      ).toBe(-1)
      expect(
        RangeList({
          ranges: List.of(Range({ anchorOffset: 1, focusOffset: 2 }))
        }).getIndexOfRange(Range({ anchorOffset: 1, focusOffset: 1 }))
      ).toBe(-1)
    })

    it('returns the index of the range that is equal to the given range', () => {
      expect(
        RangeList({ ranges: List.of(Range()) }).getIndexOfRange(Range())
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range({ anchorOffset: 2, focusOffset: 1 }),
            Range({ anchorOffset: 4, focusOffset: 3 })
          )
        }).getIndexOfRange(Range({ anchorOffset: 2, focusOffset: 1 }))
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range({ anchorOffset: 2, focusOffset: 1 }),
            Range({ anchorOffset: 4, focusOffset: 3 })
          )
        }).getIndexOfRange(Range({ anchorOffset: 4, focusOffset: 3 }))
      ).toBe(1)
    })
  })

  describe('removeRange', () => {
    it('throws when the range is not one of the current ranges', () => {
      expect(() =>
        RangeList({
          ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 }))
      ).toThrow(
        '[RangeList] removeRange: The given range is not one of the current ranges'
      )
      expect(() =>
        RangeList({
          ranges: List.of(Range(), Range({ anchorOffset: 1, focusOffset: 1 }))
        }).removeRange(Range({ anchorOffset: 1, focusOffset: 2 }))
      ).toThrow(
        '[RangeList] removeRange: The given range is not one of the current ranges'
      )
    })

    it('throws when the range is the only range', () => {
      expect(() => RangeList().removeRange(Range())).toThrow(
        '[RangeList] removeRange: Cannot remove the range if there is currently only one range in total'
      )
      expect(() =>
        RangeList().removeRange(Range({ anchorOffset: 6, focusOffset: 4 }))
      ).toThrow(
        '[RangeList] removeRange: Cannot remove the range if there is currently only one range in total'
      )
    })

    it('removes the range if it is a direct member of the current ranges', () => {
      let r0 = Range({ anchorOffset: 0, focusOffset: 0 })
      let r1 = Range({ anchorOffset: 1, focusOffset: 1 })
      let r2 = Range({ anchorOffset: 2, focusOffset: 2 })
      let r3 = Range({ anchorOffset: 3, focusOffset: 3 })
      expect(
        RangeList({ ranges: List.of(r0, r1) }).removeRange(r0).ranges
      ).toEqual(List.of(r1))
      expect(
        RangeList({ ranges: List.of(r0, r1) }).removeRange(r1).ranges
      ).toEqual(List.of(r0))
      expect(
        RangeList({ ranges: List.of(r0, r1, r3, r2) }).removeRange(r2).ranges
      ).toEqual(List.of(r0, r1, r3))
      expect(
        RangeList({ ranges: List.of(r0, r3, r1) }).removeRange(r3).ranges
      ).toEqual(List.of(r0, r1))
    })

    it("removes the range if it's value is equal to one of the current ranges", () => {
      expect(
        RangeList({
          ranges: List.of(
            Range({ anchorOffset: 0, focusOffset: 0 }),
            Range({ anchorOffset: 1, focusOffset: 1 })
          )
        }).removeRange(Range({ anchorOffset: 0, focusOffset: 0 })).ranges
      ).toEqual(List.of(Range({ anchorOffset: 1, focusOffset: 1 })))
      expect(
        RangeList({
          ranges: List.of(
            Range({ anchorOffset: 0, focusOffset: 0 }),
            Range({ anchorOffset: 1, focusOffset: 1 })
          )
        }).removeRange(Range({ anchorOffset: 1, focusOffset: 1 })).ranges
      ).toEqual(List.of(Range({ anchorOffset: 0, focusOffset: 0 })))
      expect(
        RangeList({
          ranges: List.of(
            Range({ anchorOffset: 0, focusOffset: 0 }),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 3, focusOffset: 3 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          )
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 })).ranges
      ).toEqual(
        List.of(
          Range({ anchorOffset: 0, focusOffset: 0 }),
          Range({ anchorOffset: 1, focusOffset: 1 }),
          Range({ anchorOffset: 3, focusOffset: 3 })
        )
      )
      expect(
        RangeList({
          ranges: List.of(
            Range({ anchorOffset: 0, focusOffset: 0 }),
            Range({ anchorOffset: 3, focusOffset: 3 }),
            Range({ anchorOffset: 1, focusOffset: 1 })
          )
        }).removeRange(Range({ anchorOffset: 3, focusOffset: 3 })).ranges
      ).toEqual(
        List.of(
          Range({ anchorOffset: 0, focusOffset: 0 }),
          Range({ anchorOffset: 1, focusOffset: 1 })
        )
      )
    })

    it('sets the focused range index to zero when the focused range is being removed', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          )
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 }))
          .focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).removeRange(Range({ anchorOffset: 1, focusOffset: 1 }))
          .focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 3
        }).removeRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 2
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 }))
          .focusedRangeIndex
      ).toBe(0)
    })

    it('decrements the focused range index when the given index is less than the current focused range index', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 2
        }).removeRange(Range({ anchorOffset: 1, focusOffset: 1 }))
          .focusedRangeIndex
      ).toBe(1)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).removeRange(Range()).focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 3
        }).removeRange(Range({ anchorOffset: 1, focusOffset: 1 }))
          .focusedRangeIndex
      ).toBe(2)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 2
        }).removeRange(Range()).focusedRangeIndex
      ).toBe(1)
    })

    it('retains the focused range index when the given index is greater than the current focused range index', () => {
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 0
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 }))
          .focusedRangeIndex
      ).toBe(0)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 })
          ),
          focusedRangeIndex: 1
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 }))
          .focusedRangeIndex
      ).toBe(1)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 2
        }).removeRange(Range({ anchorOffset: 3, focusOffset: 3 }))
          .focusedRangeIndex
      ).toBe(2)
      expect(
        RangeList({
          ranges: List.of(
            Range(),
            Range({ anchorOffset: 1, focusOffset: 1 }),
            Range({ anchorOffset: 2, focusOffset: 2 }),
            Range({ anchorOffset: 3, focusOffset: 3 })
          ),
          focusedRangeIndex: 0
        }).removeRange(Range({ anchorOffset: 2, focusOffset: 2 }))
          .focusedRangeIndex
      ).toBe(0)
    })
  })

  describe('simplify', () => {
    const r = (a, b) => Range({ anchorOffset: a, focusOffset: b })

    describe('when there are no overlapping ranges', () => {
      it('returns itself', () => {
        let rl = RangeList.createUnsimplified({
          ranges: List.of(r(0, 0), r(1, 1))
        })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({
          ranges: List.of(r(1, 1), r(0, 0)),
          focusedRangeIndex: 1
        })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({
          ranges: List.of(r(3, 4), r(7, 8)),
          focusedRangeIndex: 1
        })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({ ranges: List.of(r(7, 8), r(3, 4)) })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({
          ranges: List.of(r(7, 8), r(4, 3)),
          focusedRangeIndex: 1
        })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({ ranges: List.of(r(3, 4), r(8, 7)) })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified()
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({ ranges: List.of(r(12, 24)) })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({
          ranges: List.of(r(1, 1), r(2, 2), r(3, 3)),
          focusedRangeIndex: 2
        })
        expect(rl.simplify()).toBe(rl)
        rl = RangeList.createUnsimplified({
          ranges: List.of(r(10, 14), r(2, 6), r(8, 7))
        })
        expect(rl.simplify()).toBe(rl)
      })
    })

    describe('when there are overlapping ranges', () => {
      it('merges the overlapping ranges while keeping the direction of the focused range the same and the rest of the groups direction equal to that of the first range in the group sorted by first offset', () => {
        const byAnchorOffset = (a, b) => a.anchorOffset - b.anchorOffset
        expect(
          RangeList.createUnsimplified({ ranges: List.of(r(0, 0), r(0, 0)) })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(0, 0)))
        expect(
          RangeList.createUnsimplified({ ranges: List.of(r(4, 8), r(9, 4)) })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(4, 9)))
        expect(
          RangeList.createUnsimplified({ ranges: List.of(r(8, 4), r(9, 4)) })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(9, 4)))
        expect(
          RangeList.createUnsimplified({ ranges: List.of(r(4, 9), r(9, 5)) })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(4, 9)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(18, 26), r(20, 24))
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(18, 26)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(20, 24), r(26, 18))
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(18, 26)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(24, 20), r(26, 18))
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(26, 18)))
        expect(
          RangeList.createUnsimplified({ ranges: List.of(r(4, 2), r(4, 4)) })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(4, 2)))
        expect(
          RangeList.createUnsimplified({ ranges: List.of(r(8, 5), r(2, 6)) })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(8, 2)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 8), r(9, 4)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(9, 4)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(8, 4), r(9, 4)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(9, 4)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 9), r(9, 5)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(9, 4)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(18, 26), r(20, 24)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(18, 26)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(20, 24), r(26, 18)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(26, 18)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(24, 20), r(26, 18)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(26, 18)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 2), r(4, 4)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(2, 4)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(8, 5), r(2, 6)),
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(2, 8)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 4), r(4, 16), r(0, 4), r(12, 4))
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(0, 16)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 4), r(4, 16), r(0, 4), r(12, 4)),
            focusedRangeIndex: 3
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(16, 0)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 6), r(2, 3), r(7, 5))
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(2, 3), r(4, 7)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 6), r(2, 3), r(7, 5)),
            focusedRangeIndex: 2
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(2, 3), r(7, 4)))
        const ranges = List.of(
          r(2, 3),
          r(2, 0),
          r(9, 5),
          r(6, 12),
          r(14, 18),
          r(15, 16),
          r(17, 13),
          r(14, 14)
        )
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 0
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(0, 3), r(12, 5), r(18, 13)))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 1
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(3, 0), r(12, 5), r(18, 13)))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 2
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(3, 0), r(12, 5), r(18, 13)))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 3
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(3, 0), r(5, 12), r(18, 13)))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 4
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(3, 0), r(12, 5), r(13, 18)))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 5
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(3, 0), r(12, 5), r(13, 18)))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 6
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(3, 0), r(12, 5), r(18, 13)))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(14, 14), r(15, 14))
          })
            .simplify()
            .ranges.sort(byAnchorOffset)
        ).toEqual(List.of(r(14, 15)))
      })

      it('sets the focused range index to the index of the new range which contains the old focused range', () => {
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(0, 0), r(0, 0))
          }).simplify().focusedRange
        ).toEqual(r(0, 0))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 8), r(9, 4))
          }).simplify().focusedRange
        ).toEqual(r(4, 9))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(8, 4), r(9, 4))
          }).simplify().focusedRange
        ).toEqual(r(9, 4))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 9), r(9, 5))
          }).simplify().focusedRange
        ).toEqual(r(4, 9))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(18, 26), r(20, 24))
          }).simplify().focusedRange
        ).toEqual(r(18, 26))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(20, 24), r(26, 18))
          }).simplify().focusedRange
        ).toEqual(r(18, 26))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(24, 20), r(26, 18))
          }).simplify().focusedRange
        ).toEqual(r(26, 18))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 2), r(4, 4))
          }).simplify().focusedRange
        ).toEqual(r(4, 2))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 4), r(4, 16), r(0, 4), r(12, 4))
          }).simplify().focusedRange
        ).toEqual(r(0, 16))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 4), r(4, 16), r(0, 4), r(12, 4)),
            focusedRangeIndex: 3
          }).simplify().focusedRange
        ).toEqual(r(16, 0))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(4, 6), r(2, 3), r(7, 5))
          }).simplify().focusedRange
        ).toEqual(r(4, 7))
        const ranges = List.of(
          r(2, 3),
          r(2, 0),
          r(9, 5),
          r(6, 12),
          r(14, 18),
          r(15, 16),
          r(17, 13),
          r(14, 14)
        )
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 0
          }).simplify().focusedRange
        ).toEqual(r(0, 3))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 1
          }).simplify().focusedRange
        ).toEqual(r(3, 0))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 2
          }).simplify().focusedRange
        ).toEqual(r(12, 5))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 3
          }).simplify().focusedRange
        ).toEqual(r(5, 12))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 4
          }).simplify().focusedRange
        ).toEqual(r(13, 18))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 5
          }).simplify().focusedRange
        ).toEqual(r(13, 18))
        expect(
          RangeList.createUnsimplified({
            ranges,
            focusedRangeIndex: 6
          }).simplify().focusedRange
        ).toEqual(r(18, 13))
        expect(
          RangeList.createUnsimplified({
            ranges: List.of(r(14, 14), r(15, 14))
          }).simplify().focusedRange
        ).toEqual(r(14, 15))
      })
    })
  })
})
