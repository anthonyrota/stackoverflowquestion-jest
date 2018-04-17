import hoistStatics from './hoistStatics'

export default function factory(base) {
  return hoistStatics(base, (...args) => new base(...args))
}
