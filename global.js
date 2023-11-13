/**
 * @typedef Msg
 * @type {import("./engine").Msg}
 */

/**
 * @typedef Payload
 * @type {import("./engine").Payload}
 */

/**
 * @typedef Callback
 * @type {import("./engine").Callback}
 */

/**
 * @typedef RenderMode
 * @type {import("./renderMessage").RenderMode}
 */

/**
 * @typedef MsgInfo
 * @type {{
 *  id: number,
 *  args: Msg,
 *  element: HTMLElement?
 * }}
 */


/** @type {string?} */
let myChannel

/** @type {string?} */
let myNick

const myNickName = () => myNick.split('#')[0]

/** @type {import('./engine').Engine?} */
let engine

/** @type {string[]?} */
let imgHostWhitelist

/** @type {string[]?} */
let onlineUsers

let allowImages = false

let unread = 0

let globalId = 0

/** @type {{[_:number]:MsgInfo}} */
let messages = {}


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


/** @type {HTMLTextAreaElement} */
const input = $id("chatinput")

/** @type {HTMLElement} */
const footer = $id("footer")

/** @type {HTMLDivElement} */
const messagesEl = $id("messages")

/** @type {HTMLDivElement} */
const usersEl = $id("users")

/** @type {HTMLDivElement} */
const sidebar = $id("sidebar")

let isDebug

if (location.hash === '#debug') {
  isDebug = true
  const script = document.createElement('script')
  script.src="https://cdn.jsdelivr.net/npm/eruda"
  document.head.append(script)
  script.onload = () => eruda.init()
}
