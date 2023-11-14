import { createRenderer } from "./markdown.js"
import { insertAtCursor } from "./ui-utils.js"

const md = createRenderer()

const mdHtml = createRenderer({ html: true })

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
    return mdHtml.render(markup)
  } else if (mode === RenderModes.onlyHTML) {
    return markup
  } else if (mode === RenderModes.plainText) {
    return markup
  }
}

/**
 * @param {Msg} args
 * @param {object} options
 * @param {RenderMode} options.renderMode
 */
const renderMessage = (args, { renderMode = RenderModes.default } = {}) => {

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

    const date = new Date(args.time || Date.now())
    nickLinkEl.title = date.toLocaleString()
    nickSpanEl.appendChild(nickLinkEl)

    if (args.color && /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(args.color)) {
      nickLinkEl.style.color = `#${args.color}`
    } else if (args.nick === 'jeb_') {
      nickLinkEl.classList.add('jebbed')
    }

    nickLinkEl.addEventListener('click', () => {
      // Reply to a whisper or info is meaningless
      if (args.type === 'whisper' || args.nick === '*' || args.nick === '!') {
        insertAtCursor(args.text)
      } else {
        insertAtCursor(`@${args.nick} `)
      }
      input.focus()
    })

    nickLinkEl.addEventListener('contextmenu', (e) => {
      e.preventDefault()

      let replyText = ''
      let isOverLong = false

      // Cut overlong text
      if (args.text.length > 350) {
        replyText = args.text.slice(0, 350)
        isOverLong = true
      }

      // Add nickname
      if (args.trip) {
        replyText = '>' + args.trip + ' ' + args.nick + '：\n'
      } else {
        replyText = '>' + args.nick + '：\n'
      }

      // Split text by line
      let lines = args.text.split('\n')

      // Cut overlong lines
      if (lines.length >= 8) {
        lines = lines.slice(0, 8)
        overlongText = true
      }

      for (let replyLine of lines) {
        // Cut third replied text
        if (!replyLine.startsWith('>>')) {
          replyText += '>' + replyLine + '\n'
        }
      }

      // Add elipsis if text is cutted
      if (isOverLong) {
        replyText += '>……\n'
      }
      replyText += '\n'


      // Add mention when reply to others
      if (args.nick != myNickName() && args.type != 'whisper' && args.nick != '*' && args.nick != '!') {
        replyText += `@${args.nick} `
      }

      // Insert reply text
      replyText += input.value

      input.value = ''
      insertAtCursor(replyText)
      input.focus()
    })
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

  return messageEl
}

export { RenderModes, renderMarkdown, renderMessage }
