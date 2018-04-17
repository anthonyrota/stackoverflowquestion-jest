import Range from '../../src/models/Range'

describe('Range', () => {
  it('is a function', () => {
    expect(typeof Range).toBe('function')
  })

  it('can be called without the new keyword', () => {
    Range()
    expect(Range().anchorOffset).toBe(0)
    expect(Range().focusOffset).toBe(0)
  })

  it('can be called with the new keyword', () => {
    new Range()
    expect(new Range().anchorOffset).toBe(0)
    expect(new Range().focusOffset).toBe(0)
  })

  describe('static isRange', () => {
    it('is a function', () => {
      expect(typeof Range.isRange).toBe('function')
    })

    it('checks if the arguments is a Range object', () => {
      expect(Range.isRange(new Range())).toBe(true)
      expect(Range.isRange(Range())).toBe(true)
      expect(Range.isRange()).toBe(false)
      expect(Range.isRange(Range)).toBe(false)
      expect(Range.isRange({})).toBe(false)
    })
  })

  describe('anchorOffset', () => {
    it('defaults to zero', () => {
      expect(Range().anchorOffset).toBe(0)
      expect(Range({ focusOffset: 50 }).anchorOffset).toBe(0)
    })

    it('can be overriden', () => {
      expect(Range({ anchorOffset: 2 }).anchorOffset).toBe(2)
      expect(Range({ anchorOffset: 4, focusOffset: 8 }).anchorOffset).toBe(4)
    })

    it('throws when it is not a number', () => {
      expect(() => Range({ anchorOffset: false })).toThrow(
        '[Range] constructor: the anchorOffset must be a number'
      )
    })

    it('throws when it is NaN', () => {
      expect(() => Range({ anchorOffset: NaN })).toThrow(
        '[Range] constructor: the anchorOffset cannot be NaN'
      )
    })
  })

  describe('focusOffset', () => {
    it('defaults to zero', () => {
      expect(Range().focusOffset).toBe(0)
      expect(Range({ anchorOffset: 50 }).focusOffset).toBe(0)
    })

    it('can be overriden', () => {
      expect(Range({ focusOffset: 2 }).focusOffset).toBe(2)
      expect(Range({ focusOffset: 4, anchorOffset: 8 }).focusOffset).toBe(4)
    })

    it('throws when it is not a number', () => {
      expect(() => Range({ focusOffset: false })).toThrow(
        '[Range] constructor: the focusOffset must be a number'
      )
    })

    it('throws when it is NaN', () => {
      expect(() => Range({ focusOffset: NaN })).toThrow(
        '[Range] constructor: the focusOffset cannot be NaN'
      )
    })
  })

  describe('isCollapsed', () => {
    it("tests whether a range's anchorOffset equals its focusOffset", () => {
      expect(Range().isCollapsed).toBe(true)
      expect(Range({ anchorOffset: 1, focusOffset: 1 }).isCollapsed).toBe(true)
      expect(Range({ anchorOffset: 2 }).isCollapsed).toBe(false)
      expect(Range({ anchorOffset: 1, focusOffset: 4 }).isCollapsed).toBe(false)
    })
  })

  describe('isExpanded', () => {
    it("tests whether a range's anchorOffset does not equal its focusOffset", () => {
      expect(Range().isExpanded).toBe(false)
      expect(Range({ anchorOffset: 1, focusOffset: 1 }).isExpanded).toBe(false)
      expect(Range({ anchorOffset: 2 }).isExpanded).toBe(true)
      expect(Range({ anchorOffset: 1, focusOffset: 4 }).isExpanded).toBe(true)
    })
  })

  describe('firstOffset', () => {
    it('returns the smallest out of the focus and anchor offsets', () => {
      expect(Range().firstOffset).toBe(0)
      expect(Range({ anchorOffset: 1 }).firstOffset).toBe(0)
      expect(Range({ focusOffset: 18, anchorOffset: 12 }).firstOffset).toBe(12)
      expect(Range({ anchorOffset: 16, focusOffset: 4 }).firstOffset).toBe(4)
    })
  })

  describe('lastOffset', () => {
    it('returns the largest out of the focus and and anchor offsets', () => {
      expect(Range().lastOffset).toBe(0)
      expect(Range({ anchorOffset: 1 }).lastOffset).toBe(1)
      expect(Range({ focusOffset: 18, anchorOffset: 12 }).lastOffset).toBe(18)
      expect(Range({ anchorOffset: 16, focusOffset: 4 }).lastOffset).toBe(16)
    })
  })

  describe('isBackwards', () => {
    it("tests whether a range's anchorOffset is greater than its focusOffset", () => {
      expect(Range({ anchorOffset: 1 }).isBackwards).toBe(true)
      expect(Range({ anchorOffset: 20, focusOffset: 2 }).isBackwards).toBe(true)
      expect(Range({ anchorOffset: 2, focusOffset: 4 }).isBackwards).toBe(false)
      expect(Range({ focusOffset: 1 }).isBackwards).toBe(false)
      expect(Range().isBackwards).toBe(false)
      expect(Range({ anchorOffset: 6, focusOffset: 6 }).isBackwards).toBe(false)
    })
  })

  describe('isForwards', () => {
    it("tests whether a range's anchorOffset is less than or equal to its focusOffset", () => {
      expect(Range({ anchorOffset: 1 }).isForwards).toBe(false)
      expect(Range({ anchorOffset: 20, focusOffset: 2 }).isForwards).toBe(false)
      expect(Range({ anchorOffset: 2, focusOffset: 4 }).isForwards).toBe(true)
      expect(Range({ focusOffset: 1 }).isForwards).toBe(true)
      expect(Range().isForwards).toBe(true)
      expect(Range({ anchorOffset: 6, focusOffset: 6 }).isForwards).toBe(true)
    })
  })

  describe('direction', () => {
    it("is backwards if the range's anchor offset is greater than its focus offset", () => {
      expect(Range({ anchorOffset: 1 }).direction).toBe('backwards')
      expect(Range({ anchorOffset: 20, focusOffset: 2 }).direction).toBe(
        'backwards'
      )
    })

    it("is forwards if the range's anchor offset is equal to its focus offset", () => {
      expect(Range().direction).toBe('forwards')
      expect(Range({ anchorOffset: 4, focusOffset: 4 }).direction).toBe(
        'forwards'
      )
    })

    it("is forwards if the range's anchor offset is smaller than its focus offset", () => {
      expect(Range({ anchorOffset: 2, focusOffset: 4 }).direction).toBe(
        'forwards'
      )
      expect(Range({ focusOffset: 1 }).direction).toBe('forwards')
      expect(Range({ anchorOffset: 6, focusOffset: 6 }).direction).toBe(
        'forwards'
      )
    })
  })

  describe('flip', () => {
    it('swaps the anchor and focus offsets', () => {
      expect(Range().flip()).toEqual(Range({ anchorOffset: 0, focusOffset: 0 }))
      expect(Range({ anchorOffset: 2, focusOffset: 6 }).flip()).toEqual(
        Range({ anchorOffset: 6, focusOffset: 2 })
      )
      expect(Range({ anchorOffset: 50, focusOffset: 0 }).flip()).toEqual(
        Range({ anchorOffset: 0, focusOffset: 50 })
      )
    })
  })

  describe('setBackwards', () => {
    it('sets the range to be backwards if the anchor and focus offsets are different', () => {
      expect(Range().setBackwards().isBackwards).toBe(false)
      expect(
        Range({ anchorOffset: 6, focusOffset: 6 }).setBackwards().isBackwards
      ).toBe(false)
      expect(
        Range({ anchorOffset: 20, focusOffset: 3 }).setBackwards().isBackwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 2, focusOffset: 16 }).setBackwards().isBackwards
      ).toBe(true)
    })
  })

  describe('setForwards', () => {
    it('sets the range to be forwards', () => {
      expect(Range().setForwards().isForwards).toBe(true)
      expect(
        Range({ anchorOffset: 6, focusOffset: 6 }).setForwards().isForwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 20, focusOffset: 3 }).setForwards().isForwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 2, focusOffset: 16 }).setForwards().isForwards
      ).toBe(true)
    })
  })

  describe('setDirection', () => {
    it('sets the range to be forwards if the direction is forwards', () => {
      expect(Range().setDirection('forwards').isForwards).toBe(true)
      expect(
        Range({ anchorOffset: 6, focusOffset: 6 }).setDirection('forwards')
          .isForwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 20, focusOffset: 3 }).setDirection('forwards')
          .isForwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 2, focusOffset: 16 }).setDirection('forwards')
          .isForwards
      ).toBe(true)
    })

    it('sets the range to be backwards if the direction is backwards', () => {
      expect(Range().setDirection('backwards').isBackwards).toBe(false)
      expect(
        Range({ anchorOffset: 6, focusOffset: 6 }).setDirection('backwards')
          .isBackwards
      ).toBe(false)
      expect(
        Range({ anchorOffset: 20, focusOffset: 3 }).setDirection('backwards')
          .isBackwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 2, focusOffset: 16 }).setDirection('backwards')
          .isBackwards
      ).toBe(true)
    })

    it('throws if the direction is not forwards or backwards', () => {
      expect(() => Range().setDirection('232')).toThrow(
        `[Range] setDirection: The direction specified is not 'forwards' or 'backwards'`
      )
      expect(() => Range().setDirection(NaN)).toThrow(
        `[Range] setDirection: The direction specified is not 'forwards' or 'backwards'`
      )
      expect(() =>
        Range({ anchorOffset: 2, focusOffset: 3 }).setDirection(6)
      ).toThrow(
        `[Range] setDirection: The direction specified is not 'forwards' or 'backwards'`
      )
      expect(() =>
        Range({ anchorOffset: 12, focusOffset: 4 }).setDirection(null)
      ).toThrow(
        `[Range] setDirection: The direction specified is not 'forwards' or 'backwards'`
      )
    })
  })

  describe('setAnchorOffset', () => {
    it('sets the anchor offset to the one given', () => {
      expect(Range().setAnchorOffset(2).anchorOffset).toBe(2)
      expect(Range({ anchorOffset: 6 }).setAnchorOffset(0).anchorOffset).toBe(0)
      expect(Range({ anchorOffset: 23 }).setAnchorOffset(47).anchorOffset).toBe(
        47
      )
    })
  })

  describe('setFocusOffset', () => {
    it('sets the focus offset to the one given', () => {
      expect(Range().setFocusOffset(2).focusOffset).toBe(2)
      expect(Range({ focusOffset: 6 }).setFocusOffset(0).focusOffset).toBe(0)
      expect(Range({ focusOffset: 23 }).setFocusOffset(47).focusOffset).toBe(47)
    })
  })

  describe('setFirstOffset', () => {
    describe('when both offsets are the same', () => {
      it('sets the focus offset to the one given', () => {
        expect(Range().setFirstOffset(4)).toEqual(
          Range({ anchorOffset: 0, focusOffset: 4 })
        )
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).setFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).setFirstOffset(4)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 4 }))
      })
    })

    describe('when the anchor offset is less than the focus offset', () => {
      it('sets the anchor offset to the one given', () => {
        expect(
          Range({ anchorOffset: 1, focusOffset: 4 }).setFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 12, focusOffset: 4 }))
        expect(
          Range({ anchorOffset: 0, focusOffset: 1 }).setFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 12, focusOffset: 1 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 11 }).setFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 11 }))
        expect(
          Range({ anchorOffset: 3, focusOffset: 4 }).setFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 4 }))
      })
    })

    describe('when the focus offset is less than the anchor offset', () => {
      it('sets the focus offset to the one given', () => {
        expect(
          Range({ anchorOffset: 4, focusOffset: 1 }).setFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 4, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 1, focusOffset: 0 }).setFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 1, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 11, focusOffset: 6 }).setFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 11, focusOffset: 3 }))
        expect(
          Range({ anchorOffset: 4, focusOffset: 3 }).setFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 4, focusOffset: 3 }))
      })
    })
  })

  describe('setLastOffset', () => {
    describe('when both offsets are the same', () => {
      it('sets the focus offset to the one given', () => {
        expect(Range().setLastOffset(4)).toEqual(
          Range({ anchorOffset: 0, focusOffset: 4 })
        )
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).setLastOffset(12)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).setLastOffset(4)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 4 }))
      })
    })

    describe('when the anchor offset is greater than the focus offset', () => {
      it('sets the anchor offset to the one given', () => {
        expect(
          Range({ anchorOffset: 4, focusOffset: 1 }).setLastOffset(12)
        ).toEqual(Range({ anchorOffset: 12, focusOffset: 1 }))
        expect(
          Range({ anchorOffset: 1, focusOffset: 0 }).setLastOffset(12)
        ).toEqual(Range({ anchorOffset: 12, focusOffset: 0 }))
        expect(
          Range({ anchorOffset: 11, focusOffset: 6 }).setLastOffset(3)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 6 }))
        expect(
          Range({ anchorOffset: 4, focusOffset: 3 }).setLastOffset(3)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 3 }))
        expect(
          Range({ anchorOffset: 4, focusOffset: 3 }).setLastOffset(4)
        ).toEqual(Range({ anchorOffset: 4, focusOffset: 3 }))
      })
    })

    describe('when the focus offset is greater than the anchor offset', () => {
      it('sets the focus offset to the one given', () => {
        expect(
          Range({ anchorOffset: 1, focusOffset: 4 }).setLastOffset(12)
        ).toEqual(Range({ anchorOffset: 1, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 0, focusOffset: 1 }).setLastOffset(12)
        ).toEqual(Range({ anchorOffset: 0, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 11 }).setLastOffset(3)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 3 }))
        expect(
          Range({ anchorOffset: 3, focusOffset: 4 }).setLastOffset(3)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 3 }))
        expect(
          Range({ anchorOffset: 3, focusOffset: 4 }).setLastOffset(4)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 4 }))
      })
    })
  })

  describe('moveFirstOffset', () => {
    describe('when both offsets are the same', () => {
      it('moves the focus offset by the amount given', () => {
        expect(Range().moveFirstOffset(4)).toEqual(
          Range({ anchorOffset: 0, focusOffset: 4 })
        )
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).moveFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 18 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).moveFirstOffset(4)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 10 }))
      })
    })

    describe('when the anchor offset is less than the focus offset', () => {
      it('moves the anchor offset by the amount given', () => {
        expect(
          Range({ anchorOffset: 1, focusOffset: 4 }).moveFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 13, focusOffset: 4 }))
        expect(
          Range({ anchorOffset: 0, focusOffset: 1 }).moveFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 12, focusOffset: 1 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 11 }).moveFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 9, focusOffset: 11 }))
        expect(
          Range({ anchorOffset: 3, focusOffset: 4 }).moveFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 4 }))
      })
    })

    describe('when the focus offset is less than the anchor offset', () => {
      it('moves the focus offset by the amount given', () => {
        expect(
          Range({ anchorOffset: 4, focusOffset: 1 }).moveFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 4, focusOffset: 13 }))
        expect(
          Range({ anchorOffset: 1, focusOffset: 0 }).moveFirstOffset(12)
        ).toEqual(Range({ anchorOffset: 1, focusOffset: 12 }))
        expect(
          Range({ anchorOffset: 11, focusOffset: 6 }).moveFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 11, focusOffset: 9 }))
        expect(
          Range({ anchorOffset: 4, focusOffset: 3 }).moveFirstOffset(3)
        ).toEqual(Range({ anchorOffset: 4, focusOffset: 6 }))
      })
    })
  })

  describe('moveLastOffset', () => {
    describe('when both offsets are the same', () => {
      it('moves the focus offset by the amount given', () => {
        expect(Range().moveLastOffset(4)).toEqual(
          Range({ anchorOffset: 0, focusOffset: 4 })
        )
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).moveLastOffset(12)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 18 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 6 }).moveLastOffset(4)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 10 }))
      })
    })

    describe('when the anchor offset is greater than the focus offset', () => {
      it('moves the anchor offset by the amount given', () => {
        expect(
          Range({ anchorOffset: 4, focusOffset: 1 }).moveLastOffset(12)
        ).toEqual(Range({ anchorOffset: 16, focusOffset: 1 }))
        expect(
          Range({ anchorOffset: 1, focusOffset: 0 }).moveLastOffset(12)
        ).toEqual(Range({ anchorOffset: 13, focusOffset: 0 }))
        expect(
          Range({ anchorOffset: 11, focusOffset: 6 }).moveLastOffset(3)
        ).toEqual(Range({ anchorOffset: 14, focusOffset: 6 }))
        expect(
          Range({ anchorOffset: 4, focusOffset: 3 }).moveLastOffset(3)
        ).toEqual(Range({ anchorOffset: 7, focusOffset: 3 }))
        expect(
          Range({ anchorOffset: 4, focusOffset: 3 }).moveLastOffset(4)
        ).toEqual(Range({ anchorOffset: 8, focusOffset: 3 }))
      })
    })

    describe('when the focus offset is greater than the anchor offset', () => {
      it('moves the focus offset by the amount given', () => {
        expect(
          Range({ anchorOffset: 1, focusOffset: 4 }).moveLastOffset(12)
        ).toEqual(Range({ anchorOffset: 1, focusOffset: 16 }))
        expect(
          Range({ anchorOffset: 0, focusOffset: 1 }).moveLastOffset(12)
        ).toEqual(Range({ anchorOffset: 0, focusOffset: 13 }))
        expect(
          Range({ anchorOffset: 6, focusOffset: 11 }).moveLastOffset(3)
        ).toEqual(Range({ anchorOffset: 6, focusOffset: 14 }))
        expect(
          Range({ anchorOffset: 3, focusOffset: 4 }).moveLastOffset(3)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 7 }))
        expect(
          Range({ anchorOffset: 3, focusOffset: 4 }).moveLastOffset(4)
        ).toEqual(Range({ anchorOffset: 3, focusOffset: 8 }))
      })
    })
  })

  describe('moveAnchorOffset', () => {
    it('moves the anchor offset by the amount given', () => {
      expect(Range().moveAnchorOffset(2).anchorOffset).toBe(2)
      expect(Range({ anchorOffset: 6 }).moveAnchorOffset(-2).anchorOffset).toBe(
        4
      )
      expect(
        Range({ anchorOffset: 14 }).moveAnchorOffset(23).anchorOffset
      ).toBe(37)
    })
  })

  describe('moveFocusOffset', () => {
    it('moves the focus offset by the amount given', () => {
      expect(Range().moveFocusOffset(2).focusOffset).toBe(2)
      expect(Range({ focusOffset: 6 }).moveFocusOffset(-2).focusOffset).toBe(4)
      expect(Range({ focusOffset: 14 }).moveFocusOffset(23).focusOffset).toBe(
        37
      )
    })
  })

  describe('collapseAnchor', () => {
    it('sets the focus offset to the anchor offset', () => {
      expect(Range().collapseAnchor()).toEqual(Range())
      expect(
        Range({ anchorOffset: 5, focusOffset: 5 }).collapseAnchor()
      ).toEqual(Range({ anchorOffset: 5, focusOffset: 5 }))
      expect(
        Range({ anchorOffset: 5, focusOffset: 12 }).collapseAnchor()
      ).toEqual(Range({ anchorOffset: 5, focusOffset: 5 }))
      expect(
        Range({ anchorOffset: 16, focusOffset: 2 }).collapseAnchor()
      ).toEqual(Range({ anchorOffset: 16, focusOffset: 16 }))
    })
  })

  describe('collapseFocus', () => {
    it('sets the focus offset to the focus offset', () => {
      expect(Range().collapseFocus()).toEqual(Range())
      expect(
        Range({ anchorOffset: 5, focusOffset: 5 }).collapseFocus()
      ).toEqual(Range({ anchorOffset: 5, focusOffset: 5 }))
      expect(
        Range({ anchorOffset: 5, focusOffset: 12 }).collapseFocus()
      ).toEqual(Range({ anchorOffset: 12, focusOffset: 12 }))
      expect(
        Range({ anchorOffset: 16, focusOffset: 2 }).collapseFocus()
      ).toEqual(Range({ anchorOffset: 2, focusOffset: 2 }))
    })
  })

  describe('collapseBackwards', () => {
    it('sets both offsets to the first offset', () => {
      expect(Range().collapseBackwards()).toEqual(Range())
      expect(
        Range({ anchorOffset: 4, focusOffset: 4 }).collapseBackwards()
      ).toEqual(Range({ anchorOffset: 4, focusOffset: 4 }))
      expect(
        Range({ anchorOffset: 2, focusOffset: 14 }).collapseBackwards()
      ).toEqual(Range({ anchorOffset: 2, focusOffset: 2 }))
      expect(
        Range({ anchorOffset: 17, focusOffset: 6 }).collapseBackwards()
      ).toEqual(Range({ anchorOffset: 6, focusOffset: 6 }))
    })
  })

  describe('collapseForwards', () => {
    it('sets both offsets to the last offset', () => {
      expect(Range().collapseForwards()).toEqual(Range())
      expect(
        Range({ anchorOffset: 4, focusOffset: 4 }).collapseForwards()
      ).toEqual(Range({ anchorOffset: 4, focusOffset: 4 }))
      expect(
        Range({ anchorOffset: 2, focusOffset: 14 }).collapseForwards()
      ).toEqual(Range({ anchorOffset: 14, focusOffset: 14 }))
      expect(
        Range({ anchorOffset: 17, focusOffset: 6 }).collapseForwards()
      ).toEqual(Range({ anchorOffset: 17, focusOffset: 17 }))
    })
  })

  describe('contains', () => {
    const r = (a, b) => Range({ anchorOffset: a, focusOffset: b })

    it('returns true if the ranges are the same', () => {
      expect(r(0, 0).contains(r(0, 0))).toBe(true)
      expect(r(2, 2).contains(r(2, 2))).toBe(true)
      expect(r(4, 7).contains(r(4, 7))).toBe(true)
      expect(r(3, 9).contains(r(3, 9))).toBe(true)
    })

    it('returns true if the range contains the other range', () => {
      expect(r(3, 7).contains(r(3, 7))).toBe(true)
      expect(r(7, 3).contains(r(3, 7))).toBe(true)
      expect(r(3, 7).contains(r(7, 3))).toBe(true)
      expect(r(7, 3).contains(r(7, 3))).toBe(true)
      expect(r(4, 9).contains(r(4, 8))).toBe(true)
      expect(r(9, 4).contains(r(4, 8))).toBe(true)
      expect(r(4, 9).contains(r(8, 4))).toBe(true)
      expect(r(9, 4).contains(r(8, 4))).toBe(true)
      expect(r(4, 9).contains(r(5, 9))).toBe(true)
      expect(r(9, 4).contains(r(5, 9))).toBe(true)
      expect(r(4, 9).contains(r(9, 5))).toBe(true)
      expect(r(9, 4).contains(r(9, 5))).toBe(true)
      expect(r(18, 26).contains(r(20, 24))).toBe(true)
      expect(r(26, 18).contains(r(20, 24))).toBe(true)
      expect(r(18, 26).contains(r(24, 20))).toBe(true)
      expect(r(26, 18).contains(r(24, 20))).toBe(true)
      expect(r(4, 7).contains(r(5, 5))).toBe(true)
      expect(r(7, 4).contains(r(5, 5))).toBe(true)
    })

    it('returns false if the range does not contain the other range', () => {
      expect(r(3, 3).contains(r(2, 2))).toBe(false)
      expect(r(6, 6).contains(r(7, 7))).toBe(false)
      expect(r(3, 4).contains(r(1, 2))).toBe(false)
      expect(r(4, 3).contains(r(1, 2))).toBe(false)
      expect(r(3, 4).contains(r(2, 1))).toBe(false)
      expect(r(4, 3).contains(r(2, 1))).toBe(false)
      expect(r(4, 7).contains(r(8, 9))).toBe(false)
      expect(r(7, 4).contains(r(8, 9))).toBe(false)
      expect(r(4, 7).contains(r(9, 8))).toBe(false)
      expect(r(7, 4).contains(r(9, 8))).toBe(false)
      expect(r(4, 7).contains(r(3, 5))).toBe(false)
      expect(r(7, 4).contains(r(3, 5))).toBe(false)
      expect(r(4, 7).contains(r(5, 3))).toBe(false)
      expect(r(7, 4).contains(r(5, 3))).toBe(false)
      expect(r(4, 7).contains(r(3, 4))).toBe(false)
      expect(r(7, 4).contains(r(3, 4))).toBe(false)
      expect(r(4, 7).contains(r(4, 3))).toBe(false)
      expect(r(7, 4).contains(r(4, 3))).toBe(false)
      expect(r(4, 7).contains(r(6, 8))).toBe(false)
      expect(r(7, 4).contains(r(6, 8))).toBe(false)
      expect(r(4, 7).contains(r(8, 6))).toBe(false)
      expect(r(7, 4).contains(r(8, 6))).toBe(false)
      expect(r(4, 7).contains(r(7, 8))).toBe(false)
      expect(r(7, 4).contains(r(7, 8))).toBe(false)
      expect(r(4, 7).contains(r(8, 7))).toBe(false)
      expect(r(7, 4).contains(r(8, 7))).toBe(false)
      expect(r(4, 8).contains(r(4, 9))).toBe(false)
      expect(r(8, 4).contains(r(4, 9))).toBe(false)
      expect(r(4, 8).contains(r(9, 4))).toBe(false)
      expect(r(8, 4).contains(r(9, 4))).toBe(false)
      expect(r(5, 9).contains(r(4, 9))).toBe(false)
      expect(r(9, 5).contains(r(4, 9))).toBe(false)
      expect(r(5, 9).contains(r(9, 4))).toBe(false)
      expect(r(9, 5).contains(r(9, 4))).toBe(false)
      expect(r(20, 24).contains(r(18, 26))).toBe(false)
      expect(r(24, 20).contains(r(18, 26))).toBe(false)
      expect(r(20, 24).contains(r(26, 18))).toBe(false)
      expect(r(24, 20).contains(r(26, 18))).toBe(false)
      expect(r(5, 5).contains(r(4, 7))).toBe(false)
      expect(r(5, 5).contains(r(7, 4))).toBe(false)
    })
  })

  describe('mergeWithRange', () => {
    describe('when the second range is contained by the first', () => {
      it('returns the first range', () => {
        let r1 = Range()
        let r2 = Range()
        expect(r1.mergeWithRange(r2)).toEqual(r1)
        r1 = Range({ anchorOffset: 3, focusOffset: 7 })
        r2 = Range({ anchorOffset: 3, focusOffset: 7 })
        expect(r1.mergeWithRange(r2)).toEqual(r1)
        r1 = Range({ anchorOffset: 4, focusOffset: 9 })
        r2 = Range({ anchorOffset: 8, focusOffset: 4 })
        expect(r1.mergeWithRange(r2)).toEqual(r1)
        r1 = Range({ anchorOffset: 4, focusOffset: 9 })
        r2 = Range({ anchorOffset: 5, focusOffset: 9 })
        expect(r1.mergeWithRange(r2)).toEqual(r1)
        r1 = Range({ anchorOffset: 18, focusOffset: 26 })
        r2 = Range({ anchorOffset: 24, focusOffset: 20 })
        expect(r1.mergeWithRange(r2)).toEqual(r1)
      })
    })

    describe('when the first range is contained by the second', () => {
      it('returns the second range', () => {
        let r1 = Range()
        let r2 = Range()
        expect(r1.mergeWithRange(r2)).toEqual(r2)
        r1 = Range({ anchorOffset: 3, focusOffset: 7 })
        r2 = Range({ anchorOffset: 3, focusOffset: 7 })
        expect(r1.mergeWithRange(r2)).toEqual(r2)
        r1 = Range({ anchorOffset: 8, focusOffset: 4 })
        r2 = Range({ anchorOffset: 4, focusOffset: 9 })
        expect(r1.mergeWithRange(r2)).toEqual(r2)
        r1 = Range({ anchorOffset: 5, focusOffset: 9 })
        r2 = Range({ anchorOffset: 4, focusOffset: 9 })
        expect(r1.mergeWithRange(r2)).toEqual(r2)
        r1 = Range({ anchorOffset: 24, focusOffset: 20 })
        r2 = Range({ anchorOffset: 18, focusOffset: 26 })
        expect(r1.mergeWithRange(r2)).toEqual(r2)
      })
    })

    describe('when neither range touches eachother', () => {
      it('throws an error', () => {
        const error =
          '[Range] mergeWithRange: Neither range touches eachother and so the ranges cannot merge together'
        let r1 = Range()
        let r2 = Range({ anchorOffset: 20, focusOffset: 20 })
        expect(() => r1.mergeWithRange(r2)).toThrow(error)
        expect(() => r2.mergeWithRange(r1)).toThrow(error)
        r1 = Range({ anchorOffset: 2, focusOffset: 4 })
        r2 = Range({ anchorOffset: 9, focusOffset: 8 })
        expect(() => r1.mergeWithRange(r2)).toThrow(error)
        expect(() => r2.mergeWithRange(r1)).toThrow(error)
      })
    })

    describe('when the first range is partially contained by the second one', () => {
      describe('and the first range is forwards', () => {
        it('returns a new range engulfing both the first and last range which is forwards', () => {
          expect(
            Range({ anchorOffset: 0, focusOffset: 1 }).mergeWithRange(
              Range({ anchorOffset: 1, focusOffset: 2 })
            )
          ).toEqual(Range({ anchorOffset: 0, focusOffset: 2 }))
          expect(
            Range({ anchorOffset: 0, focusOffset: 2 }).mergeWithRange(
              Range({ anchorOffset: 1, focusOffset: 3 })
            )
          ).toEqual(Range({ anchorOffset: 0, focusOffset: 3 }))
          expect(
            Range({ anchorOffset: 17, focusOffset: 23 }).mergeWithRange(
              Range({ anchorOffset: 19, focusOffset: 27 })
            )
          ).toEqual(Range({ anchorOffset: 17, focusOffset: 27 }))
        })
      })

      describe('and when the first range is backwards', () => {
        it('returns a new range engulfing both the first and last range which is backwards', () => {
          expect(
            Range({ anchorOffset: 1, focusOffset: 0 }).mergeWithRange(
              Range({ anchorOffset: 1, focusOffset: 2 })
            )
          ).toEqual(Range({ anchorOffset: 2, focusOffset: 0 }))
          expect(
            Range({ anchorOffset: 2, focusOffset: 0 }).mergeWithRange(
              Range({ anchorOffset: 1, focusOffset: 3 })
            )
          ).toEqual(Range({ anchorOffset: 3, focusOffset: 0 }))
          expect(
            Range({ anchorOffset: 23, focusOffset: 17 }).mergeWithRange(
              Range({ anchorOffset: 19, focusOffset: 27 })
            )
          ).toEqual(Range({ anchorOffset: 27, focusOffset: 17 }))
        })
      })
    })
  })

  describe('touches', () => {
    const r = (a, b) => Range({ anchorOffset: a, focusOffset: b })

    it('returns true if one range touches the other', () => {
      expect(r(0, 0).touches(r(0, 0))).toBe(true)
      expect(r(2, 2).touches(r(2, 2))).toBe(true)
      expect(r(3, 7).touches(r(3, 7))).toBe(true)
      expect(r(7, 3).touches(r(3, 7))).toBe(true)
      expect(r(3, 7).touches(r(7, 3))).toBe(true)
      expect(r(7, 3).touches(r(7, 3))).toBe(true)
      expect(r(4, 9).touches(r(4, 8))).toBe(true)
      expect(r(4, 8).touches(r(4, 9))).toBe(true)
      expect(r(9, 4).touches(r(4, 8))).toBe(true)
      expect(r(4, 8).touches(r(9, 4))).toBe(true)
      expect(r(4, 9).touches(r(8, 4))).toBe(true)
      expect(r(8, 4).touches(r(4, 9))).toBe(true)
      expect(r(9, 4).touches(r(8, 4))).toBe(true)
      expect(r(8, 4).touches(r(9, 4))).toBe(true)
      expect(r(4, 9).touches(r(5, 9))).toBe(true)
      expect(r(5, 9).touches(r(4, 9))).toBe(true)
      expect(r(9, 4).touches(r(5, 9))).toBe(true)
      expect(r(5, 9).touches(r(9, 4))).toBe(true)
      expect(r(4, 9).touches(r(9, 5))).toBe(true)
      expect(r(9, 5).touches(r(4, 9))).toBe(true)
      expect(r(9, 4).touches(r(9, 5))).toBe(true)
      expect(r(9, 5).touches(r(9, 4))).toBe(true)
      expect(r(18, 26).touches(r(20, 24))).toBe(true)
      expect(r(20, 24).touches(r(18, 26))).toBe(true)
      expect(r(26, 18).touches(r(20, 24))).toBe(true)
      expect(r(20, 24).touches(r(26, 18))).toBe(true)
      expect(r(18, 26).touches(r(24, 20))).toBe(true)
      expect(r(24, 20).touches(r(18, 26))).toBe(true)
      expect(r(26, 18).touches(r(24, 20))).toBe(true)
      expect(r(24, 20).touches(r(26, 18))).toBe(true)
      expect(r(4, 7).touches(r(5, 5))).toBe(true)
      expect(r(5, 5).touches(r(4, 7))).toBe(true)
      expect(r(7, 4).touches(r(5, 5))).toBe(true)
      expect(r(5, 5).touches(r(7, 4))).toBe(true)
      expect(r(2, 4).touches(r(4, 4))).toBe(true)
      expect(r(4, 4).touches(r(2, 4))).toBe(true)
      expect(r(4, 2).touches(r(4, 4))).toBe(true)
      expect(r(4, 4).touches(r(4, 2))).toBe(true)
      expect(r(2, 4).touches(r(1, 3))).toBe(true)
      expect(r(1, 3).touches(r(2, 4))).toBe(true)
      expect(r(4, 2).touches(r(1, 3))).toBe(true)
      expect(r(1, 3).touches(r(4, 2))).toBe(true)
      expect(r(2, 4).touches(r(3, 1))).toBe(true)
      expect(r(3, 1).touches(r(2, 4))).toBe(true)
      expect(r(4, 2).touches(r(3, 1))).toBe(true)
      expect(r(3, 1).touches(r(4, 2))).toBe(true)
      expect(r(2, 6).touches(r(5, 8))).toBe(true)
      expect(r(5, 8).touches(r(2, 6))).toBe(true)
      expect(r(6, 2).touches(r(5, 8))).toBe(true)
      expect(r(5, 8).touches(r(6, 2))).toBe(true)
      expect(r(2, 6).touches(r(8, 5))).toBe(true)
      expect(r(8, 5).touches(r(2, 6))).toBe(true)
      expect(r(6, 2).touches(r(8, 5))).toBe(true)
      expect(r(8, 5).touches(r(6, 2))).toBe(true)
      expect(r(2, 6).touches(r(2, 2))).toBe(true)
      expect(r(2, 2).touches(r(2, 6))).toBe(true)
      expect(r(6, 2).touches(r(2, 2))).toBe(true)
      expect(r(2, 2).touches(r(6, 2))).toBe(true)
      expect(r(2, 6).touches(r(1, 6))).toBe(true)
      expect(r(1, 6).touches(r(2, 6))).toBe(true)
      expect(r(6, 2).touches(r(1, 6))).toBe(true)
      expect(r(1, 6).touches(r(6, 2))).toBe(true)
      expect(r(2, 6).touches(r(6, 1))).toBe(true)
      expect(r(6, 1).touches(r(2, 6))).toBe(true)
      expect(r(6, 2).touches(r(6, 1))).toBe(true)
      expect(r(6, 1).touches(r(6, 2))).toBe(true)
    })

    it('returns false if one range does not touch the other', () => {
      expect(r(0, 0).touches(r(1, 1))).toBe(false)
      expect(r(1, 1).touches(r(0, 0))).toBe(false)
      expect(r(0, 0).touches(r(2, 2))).toBe(false)
      expect(r(2, 2).touches(r(0, 0))).toBe(false)
      expect(r(3, 4).touches(r(7, 8))).toBe(false)
      expect(r(7, 8).touches(r(3, 4))).toBe(false)
      expect(r(4, 3).touches(r(7, 8))).toBe(false)
      expect(r(7, 8).touches(r(4, 3))).toBe(false)
      expect(r(3, 4).touches(r(8, 7))).toBe(false)
      expect(r(8, 7).touches(r(3, 4))).toBe(false)
      expect(r(4, 3).touches(r(8, 7))).toBe(false)
      expect(r(8, 7).touches(r(4, 3))).toBe(false)
      expect(r(5, 8).touches(r(1, 2))).toBe(false)
      expect(r(1, 2).touches(r(5, 8))).toBe(false)
      expect(r(8, 5).touches(r(1, 2))).toBe(false)
      expect(r(1, 2).touches(r(8, 5))).toBe(false)
      expect(r(5, 8).touches(r(2, 1))).toBe(false)
      expect(r(2, 1).touches(r(5, 8))).toBe(false)
      expect(r(8, 5).touches(r(2, 1))).toBe(false)
      expect(r(2, 1).touches(r(8, 5))).toBe(false)
      expect(r(3, 4).touches(r(9, 8))).toBe(false)
      expect(r(9, 8).touches(r(3, 4))).toBe(false)
      expect(r(4, 3).touches(r(9, 8))).toBe(false)
      expect(r(9, 8).touches(r(4, 3))).toBe(false)
      expect(r(3, 4).touches(r(8, 9))).toBe(false)
      expect(r(8, 9).touches(r(3, 4))).toBe(false)
      expect(r(4, 3).touches(r(8, 9))).toBe(false)
      expect(r(8, 9).touches(r(4, 3))).toBe(false)
      expect(r(4, 8).touches(r(20, 13))).toBe(false)
      expect(r(20, 13).touches(r(4, 8))).toBe(false)
      expect(r(8, 4).touches(r(20, 13))).toBe(false)
      expect(r(20, 13).touches(r(8, 4))).toBe(false)
      expect(r(4, 8).touches(r(13, 20))).toBe(false)
      expect(r(13, 20).touches(r(4, 8))).toBe(false)
      expect(r(8, 4).touches(r(13, 20))).toBe(false)
      expect(r(13, 20).touches(r(8, 4))).toBe(false)
    })
  })
})
