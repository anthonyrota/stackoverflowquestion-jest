const knownStatics = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
}

function hoistStatics(source, target) {
  const keys = [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source)
  ]

  keys.forEach(key => {
    if (!knownStatics[key]) {
      try {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        )
      } catch (e) {}
    }
  })

  return target
}

export default function(source, target) {
  if (typeof target === 'function') {
    return hoistStatics(
      source,
      hoistStatics(target, (...args) => target(...args))
    )
  }

  return hoistStatics(source, Object.assign({}, target))
}
