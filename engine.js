/**
 * Abstraction of WebSocket connection.
 */

import EventEmitter from 'eventemitter3'

/**
 * @typedef {object} Payload
 * @property {string} cmd
 * @property {string} [channel]
 * @property {string} [nick]
 * @property {string} [text]
 */

/**
 * @typedef {object} Msg
 * 
 * @property {string} text
 * 
 * @property {string} [cmd]
 * 
 * @property {string} [type]
 * @property {string} [nick]
 * @property {string} [trip]
 * @property {string} [from]
 * 
 * @property {string[]} [nicks]
 * 
 * @property {string?} [time]
 * 
 * @property {boolean} [admin]
 * @property {boolean} [mod]
 */

/**
 * @typedef {function(Msg):void} Callback
 */


const Commands = Object.freeze({
  chat: "chat",
  updateMessage: "updateMessage",
  info: "info",
  emote: "emote",
  warn: "warn",
  onlineSet: "onlineSet",
  onlineAdd: "onlineAdd",
  onlineRemove: "onlineRemove",
  updateUser: "updateUser",
  captcha: "captcha",

  noCmd: Symbol("noCmd"),
})

const Events = Object.freeze({
  message: Symbol("message"),
  rawMessage: Symbol("rawMessage")
})

class Engine extends EventEmitter {
  /** @type {string} */
  ws_url

  /** @type {boolean} */
  joined

  /** @type {string} */
  channel

  /**
   * @param {string} ws_url
   */
  constructor(ws_url) {
    super()

    this.ws_url = ws_url
    this.joined = false
  }

  /**
   * @param {Payload} data
   */
  send(data) {
    this.ws.send(JSON.stringify(data))
  }

  /**
   * @returns {Promise<void>}
   */
  async connect() {
    return await new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.ws_url)

      this.ws.onmessage = (e) => {
        /** @type {Msg} */
        const msg = JSON.parse(e.data)

        this.emit(Events.rawMessage, e.data)

        this.emit(Events.message, msg)

        this.emit(msg.cmd ?? Commands.noCmd, msg)
      }

      this.ws.onopen = () => resolve()
    })
  }

  /**
   * @param {string} channel
   * @param {string} nick
   */
  async join(channel, nick) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Connection not established yet")
    }

    this.send({ cmd: "join", channel, nick })

    await new Promise((resolve, reject) => {
      this.once(Commands.onlineSet, () => resolve())
    })

    this.joined = true
    this.channel = channel
  }

  close() {
    this.ws.close()

    this.joined = false
  }
}

export { Engine, Commands, Events }
