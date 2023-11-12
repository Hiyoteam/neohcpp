import { Commands, Engine, Events } from "./engine"
import { displayMessage, renderMarkdown } from "./renderMessage"

engine = new Engine("wss://hack.chat/chat-ws")

/**
 * @param {Msg} args
 * @param {object} options
 * @param {HTMLElement?} options.target
 * @param {RenderMode} options.renderMode
 */
const pushMessage = (args, { target, renderMode } = {}) => {
  displayMessage(args, { target, renderMode })
}

engine.on(Commands.chat, (args) => {
  pushMessage(args)
})

engine.on(Commands.info, (args) => {
  pushMessage({ ...args, 'nick': '*' })
})

engine.on(Commands.emote, (args) => {
  pushMessage({ ...args, 'nick': '*' })
})

engine.on(Commands.warn, (args) => {
  pushMessage({ ...args, 'nick': '!' })
})

engine.on(Commands.onlineSet, (args) => {
  const nicksHTML = args.nicks.map((nick) => {
    if (nick.match(/^_+$/)) {
      return nick // such nicknames made up of only underlines will be rendered into a horizontal rule. 
    }
    const div = document.createElement('div')
    div.innerHTML = renderMarkdown(nick)
    return div.firstChild.innerHTML
  })

  pushMessage({ nick: '*', "text": "Users online: " + nicksHTML.join(", ") }, { renderMode: "onlyHTML" })
})

export { pushMessage }
