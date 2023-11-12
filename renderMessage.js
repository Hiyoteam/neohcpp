import { createRenderer } from "./markdown"

const md = createRenderer()

const RenderModes = Object.freeze({
  default: "default",
  allowHTML: "allowHTML",
  onlyHTML: "onlyHTML",
  plainText: "plainText",
})

/**
 * @typedef RenderMode
 * @type {RenderModes[keyof RenderModes]}
 */

/**
 * @param {string} markup
 * @param {object} options
 * @param {RenderMode} options.mode
 */
const renderMarkdown = (markup, { mode = RenderModes.default } = {}) => {
  if (mode === RenderModes.default) {
    return md.render(markup)
  } else if (mode === RenderModes.allowHTML) {
    md.set({ html: true })
    let result = md.render(markup)
    md.set({ html: false })
    return result
  } else if (mode === RenderModes.onlyHTML) {
    return markup
  } else if (mode === RenderModes.plainText) {
    return markup
  }
}

/**
 * @param {Msg} args
 * @param {object} options
 * @param {HTMLElement?} options.target
 * @param {RenderMode} options.renderMode
 */
const displayMessage = (args, { target = null, renderMode = RenderModes.default } = {}) => {

  // Message container
  const messageEl = document.createElement('div')

  messageEl.classList.add('message')

  if (args.nick === myNick) {
    messageEl.classList.add('me')
  } else if (args.nick === '!') {
    messageEl.classList.add('warn')
  } else if (args.nick === '*') {
    messageEl.classList.add('info')
  } else if (args.admin) {
    messageEl.classList.add('admin')
  } else if (args.mod) {
    messageEl.classList.add('mod')
  }

  // Nickname
  const nickSpanEl = document.createElement('span')
  nickSpanEl.classList.add('nick', 'chat-nick')
  messageEl.appendChild(nickSpanEl)

  if (args.trip) {
    const tripEl = document.createElement('span')
    tripEl.textContent = args.trip + ' '
    tripEl.classList.add('trip')
    nickSpanEl.appendChild(tripEl)
  }

  if (args.nick) {
    const nickLinkEl = document.createElement('a')
    nickLinkEl.textContent = args.nick

    nickLinkEl.onclick = function () {
      insertAtCursor("@" + args.nick + ' ')
      input.focus()
    }

    const date = new Date(args.time || Date.now())
    nickLinkEl.title = date.toLocaleString()
    nickSpanEl.appendChild(nickLinkEl)
  }

  // Text
  const textEl = document.createElement('p')
  textEl.classList.add('text')

  let rendered = renderMarkdown(args.text, { mode: renderMode })

  if (renderMode === RenderModes.plainText) {
    textEl.textContent = rendered
  } else {
    textEl.innerHTML = rendered
  }

  messageEl.appendChild(textEl)

  const wasAtBottom = isAtBottom()

  if (!target) {
    messagesEl.appendChild(messageEl)
  } else {
    target.replaceWith(messageEl)
  }

  if (wasAtBottom) {
    scrollToBottom()
  }
}

export { RenderModes, renderMarkdown, displayMessage }
