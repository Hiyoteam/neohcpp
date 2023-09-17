const $ = {}

const $def = (key, getter, setter) => {
  Object.defineProperty($, key, {
    get: getter,
    set: setter
  })
}

export { $, $def }
