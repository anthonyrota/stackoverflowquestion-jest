import factory from '../../src/utils/factory'

describe('factory', () => {
  it('allows a class to be used without the new keyword', () => {
    factory(class {})()
  })

  it('retains the ability to use the class with the new keyword', () => {
    new (factory(class {}))()
  })

  it('hoists static methods', () => {
    class A {
      static foo = 'bar'
    }
    const factoryA = factory(A)
    expect(factoryA.foo).toBe(A.foo)
    expect(factoryA.foo).toBe('bar')

    class B {
      static foo() {
        return 2
      }
    }
    const factoryB = factory(B)
    expect(typeof factoryB.foo).toBe('function')
    expect(factoryB.foo).toBe(B.foo)
    expect(factoryB.foo()).toBe(2)

    class C {
      static get foo() {
        return 'bar'
      }
    }
    const factoryC = factory(C)
    expect(factoryC.foo).toBe(C.foo)
    expect(factoryC.foo).toBe('bar')
    expect(Object.getOwnPropertyDescriptor(factoryC, 'foo')).toEqual(
      Object.getOwnPropertyDescriptor(C, 'foo')
    )

    class D {
      static get foo() {
        return this._foo
      }
      static set foo(foo) {
        this.foo = foo
      }
    }
    const factoryD = factory(D)
    expect(factoryD.foo).toBeUndefined()
    expect(factoryD.foo).toBe(D.foo)
    expect(Object.getOwnPropertyDescriptor(factoryD, 'foo')).toEqual(
      Object.getOwnPropertyDescriptor(D, 'foo')
    )

    const sym = Symbol()
    class E {}
    E[sym] = 2
    const factoryE = factory(E)
    expect(factoryE[sym]).toBe(E[sym])
    expect(factoryE[sym]).toBe(2)
  })

  it('hoists prototype methods', () => {
    const sym = Symbol()
    class A {
      [sym]() {
        return 'sym'
      }
      method() {
        return 'method'
      }
      get a() {
        return 'get a'
      }
      set a(a) {
        this.a = a
      }
      b = 'b'
    }
    const factoryA = factory(A)
    const a = factoryA()
    const b = new A()
    const expectWorks = (key, val) => {
      expect(a[key]).toBe(b[key])
      expect(typeof a[key] === 'function' ? a[key]() : a[key]).toBe(val)
      expect(Object.getOwnPropertyDescriptor(a[key])).toEqual(
        Object.getOwnPropertyDescriptor(b[key])
      )
    }
    expectWorks(sym, 'sym')
    expectWorks('method', 'method')
    expectWorks('a', 'get a')
    expectWorks('b', 'b')
  })
})
