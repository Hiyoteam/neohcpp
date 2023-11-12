const isAtBottom = () => (
  (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 1)
)

const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight)
}

/**
 * @param {string} selectors
 * @returns {Element|HTMLElement|null}
 */
const $css = (selectors) => {
  return document.querySelector(selectors)
}

/**
 * @param {string} elementId
 * @returns {HTMLElement|null}
 */
const $id = (elementId) => {
  return document.getElementById(elementId)
}
/**
 * @param {string} key
 * @returns {any}
 */
const localStorageGet = (key) => {
  const value = window.localStorage[key]
  if (value) {
    return JSON.parse(value)
  }
}

/**
 * @param {string} key
 * @param {any} value
 */
const localStorageSet = (key, value) => {
  window.localStorage[key] = JSON.stringify(value)
}

export { isAtBottom, scrollToBottom, $css, $id, localStorageGet, localStorageSet }
