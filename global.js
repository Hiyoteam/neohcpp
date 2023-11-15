/**
 * @typedef Msg
 * @type {import('./engine.js').Msg}
 */

/**
 * @typedef Payload
 * @type {import('./engine.js').Payload}
 */

/**
 * @typedef Callback
 * @type {import('./engine.js').Callback}
 */

/**
 * @typedef RenderMode
 * @type {import('./render-message.js').RenderMode}
 */

/**
 * @typedef MsgInfo
 * @type {{
 * id: number,
 * args: Msg,
 * element: HTMLElement?
 * }}
 */

/**
 * @typedef User
 * @type {{
 * channel: string,
 * color: string|false,
 * hash: string,
 * isBot: boolean,
 * isme: boolean,
 * level: number,
 * nick: string,
 * trip: string,
 * uType: string,
 * userid: number
 * }}
 */


/** @type {string?} */
let myChannel

/** @type {string?} */
let myNick

const myNickName = () => myNick.split('#')[0]

/** @type {import('./engine.js').Engine?} */
let engine

/** @type {string[]?} */
let imgHostWhitelist = [
	'i.imgur.com',
	'imgur.com',
	'share.lyka.pro',
	'cdn.discordapp.com',
	'i.gyazo.com',
	'img.thz.cool',
	'i.loli.net', 's2.loli.net', //SM-MS图床
	's1.ax1x.com', 's2.ax1x.com', 'z3.ax1x.com', 's4.ax1x.com', //路过图床
	'i.postimg.cc', //postimages图床
	'mrpig.eu.org', //慕容猪的图床
	'gimg2.baidu.com', //百度
	'files.catbox.moe', //catbox
	'img.liyuv.top', //李鱼图床
	location.hostname, // 允许我自己
	'img.zhangsoft.cf', // 小张图床
	'bed.paperee.repl.co', 'filebed.paperee.guru', // 纸片君ee的纸床
	'imagebed.s3.bitiful.net', //Dr0让加的
	'img1.imgtp.com', 'imgtp.com', // imgtp
	'api.helloos.eu.org', // HelloOsMe's API
	'cdn.luogu.com.cn', // luogu
	'i.ibb.co', // imgbb
	'picshack.net',
	'hcimg.s3.bitiful.net', //24a's
] // Some are copied from https://github.com/ZhangChat-Dev-Group/ZhangChat/

/** @type {import('./ref.ts').$ref<User[]>?} */
let $onlineUsers

let allowImages = true

let unread = 0

let globalId = 0

/** @type {{[_:number]:MsgInfo}} */
let messages = {}

/**
 * @param {Msg} args
 * @param {object} options
 * @param {HTMLElement?} options.target
 * @param {RenderMode} options.renderMode
 */
var pushMessage = (args, { target, renderMode } = {}) => { if (false) return; throw new Error("Should have been implemented in client.js") }


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

const isDebug = location.hash === '#debug'

if (isDebug) {
  const script = document.createElement('script')
  script.src="https://cdn.jsdelivr.net/npm/eruda"
  document.head.append(script)
  script.onload = () => eruda.init()
}
