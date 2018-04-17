import hoistStatics from '../../src/utils/hoistStatics'

describe('hoistStatics', () => {
  let statics
  let sym
  beforeEach(() => {
    sym = Symbol()
    statics = class {
      static [sym] = 'sym'
      static bar = 'baz'
      static property = 'staticProperty'
      property = 'property'
      static method() {}
      method() {}
      static get foo() {}
      static set foo(v) {}
    }
  })

  const expectPropertyEqual = (a, b, prop) => {
    expect(a[prop]).toBe(b[prop])
    expect(Object.getOwnPropertyDescriptor(a, prop)).toEqual(
      Object.getOwnPropertyDescriptor(b, prop)
    )
  }

  describe('for objects', () => {
    it('does not alter the original parameter', () => {
      const orig = {}
      hoistStatics(statics, orig)
      expect(orig).toEqual({})
    })

    it('ignores known statics', () => {
      const orig = {
        name: Symbol(),
        length: Symbol(),
        prototype: Symbol(),
        caller: Symbol(),
        callee: Symbol(),
        arguments: Symbol(),
        arity: Symbol()
      }
      const hoisted = hoistStatics(statics, orig)
      Object.keys(orig).forEach(key => {
        expect(hoisted[key]).toBe(orig[key])
      })
    })

    it('hoists the statics', () => {
      const hoisted = hoistStatics(statics, {
        property: 'ignored',
        nonExistantProperty: 'nonExistantProperty'
      })
      expect(hoisted).toEqual({
        property: 'staticProperty',
        nonExistantProperty: 'nonExistantProperty',
        [sym]: 'sym',
        bar: 'baz'
      })
      expectPropertyEqual(statics, hoisted, 'method')
      expectPropertyEqual(statics, hoisted, 'foo')
    })
  })

  describe('for functions', () => {
    it('does not alter the original parameter', () => {
      const orig = function() {}
      hoistStatics(statics, orig)
      expect('property' in orig).toBe(false)
    })

    it('hoists the statics', () => {
      const hoisted = hoistStatics(
        statics,
        Object.assign(function() {}, {
          property: 'ignored',
          nonExistantProperty: 'nonExistantProperty'
        })
      )
      expect(hoisted).toHaveProperty(
        'nonExistantProperty',
        'nonExistantProperty'
      )
      expectPropertyEqual(statics, hoisted, 'property')
      expectPropertyEqual(statics, hoisted, 'bar')
      expectPropertyEqual(statics, hoisted, 'method')
      expectPropertyEqual(statics, hoisted, 'foo')
      expectPropertyEqual(statics, hoisted, sym)
    })
  })
})
