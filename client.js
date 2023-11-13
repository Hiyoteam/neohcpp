/**
 * Manages client states.
 */

import { Commands, Engine, Events } from "./engine"
import { renderMessage, renderMarkdown } from "./renderMessage"

engine = new Engine("wss://hack.chat/chat-ws")

/**
 * @param {Msg} args
 * @param {object} options
 * @param {HTMLElement?} options.target
 * @param {RenderMode} options.renderMode
 */
const pushMessage = (args, { target, renderMode } = {}) => {
  let id = globalId
  globalId++

  messages[id] = {
    id,
    args,
  }
  let messageEl = renderMessage(args, { target, renderMode })
  messageEl.id = `message_${id}`

  messages[id].element = messageEl

  const wasAtBottom = isAtBottom()

  messagesEl.appendChild(messageEl)

  if (myChannel !== '' && wasAtBottom) {
    scrollToBottom()
  }
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

engine.on(Commands.onlineAdd, (args) => {
  pushMessage({ ...args, 'nick': '*', text: `${args.nick} joined` })
})

engine.on(Commands.onlineAdd, (args) => {
  pushMessage({ ...args, 'nick': '*', text: `${args.nick} left` })
})

engine.on(Commands.captcha, (args) => {
  const NS = 'http://www.w3.org/2000/svg'

  let messageEl = document.createElement('div');
  messageEl.classList.add('message', 'info');


  let nickSpanEl = document.createElement('span');
  nickSpanEl.classList.add('nick');
  messageEl.appendChild(nickSpanEl);

  let nickLinkEl = document.createElement('a');
  nickLinkEl.textContent = '#';
  nickSpanEl.appendChild(nickLinkEl);

  let pEl = document.createElement('p')
  pEl.classList.add('text')

  let lines = args.text.split(/\n/g)

  // Core principle: In SVG text can be smaller than 12px even in Chrome.
  let svgEl = document.createElementNS(NS, 'svg')
  svgEl.setAttribute('white-space', 'pre')
  svgEl.style.backgroundColor = '#4e4e4e'
  svgEl.style.width = '100%'

  // In order to make 40em work right.
  svgEl.style.fontSize = `${$id('messages').clientWidth / lines[0].length * 1.5}px`
  // Captcha text is about 41 lines.
  svgEl.style.height = '41em'

  // I have tried `white-space: pre` but it didn't work, so I write each line in individual text tags.
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let textEl = document.createElementNS(NS, 'text')
    textEl.innerHTML = line

    // In order to make it in the right position.
    textEl.setAttribute('y', `${i + 1}em`)

    // Captcha text shouldn't overflow #messages element, so I divide the width of the messages container with the overvalued length of each line in order to get an undervalued max width of each character, and than multiply it by 2 (The overvalued aspect ratio of a character) because the font-size attribute means the height of a character.
    textEl.setAttribute('font-size', `${$id('messages').clientWidth / lines[0].length * 1.5}px`)
    textEl.setAttribute('fill', 'white')

    // Preserve spaces.
    textEl.style.whiteSpace = 'pre'

    svgEl.appendChild(textEl)
  }

  pEl.appendChild(svgEl)

  messageEl.appendChild(pEl);
  messagesEl.appendChild(messageEl);

  scrollToBottom()
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
