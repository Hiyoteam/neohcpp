/** @type {string?} */
let myChannel

/** @type {string?} */
let myNick

/** @type {import('./engine').Engine?} */
let engine

/** @type {string[]?} */
let imgHostWhitelist

/** @type {string[]?} */
let onlineUsers

let allowImages = false

let unread = 0

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
