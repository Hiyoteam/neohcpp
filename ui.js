import { input, footer, messagesEl } from "./html"
import { createRenderer } from "./markdown"
import { isAtBottom, scrollToBottom } from "./utils"
import { updateInputSize, insertAtCursor, backspaceAtCursor } from "./ui_utils"
import { html } from "./ui_utils"

const md = createRenderer()

/**
 * @param {string} markdown
 * @returns {string}
 */
const render = (markdown) => md.render(markdown)

const updateTitle = () => {
  const isFrontPage = myChannel === ''

  if (isFrontPage || (windowActive && isAtBottom())) {
    unread = 0
  }

  const title = (() => {
    if (isFrontPage) {
      return "hack.chat++"
    }
    if (unread > 0) {
      return `(${unread}) ${myChannel} - hack.chat++`
    }
    return `${myChannel} - hack.chat++`
  })()

  document.title = title
}

window.addEventListener("focus", () => {
  windowActive = true
  updateTitle()
})

window.addEventListener("blur", () => {
  windowActive = false
})

window.addEventListener("scroll", () => {
  if (isAtBottom()) {
    updateTitle()
  }
})

/**
 * @param {Msg} args
 * @param {HTMLElement?} target
 */
const displayMessage = (args, { target = null }) => {
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
  nickSpanEl.classList.add('nick')
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
  if (args[html]) {
    textEl.innerHTML = args[html]
  } else {
    textEl.innerHTML = md.render(args.text)
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

let lastSent = [""]
let lastSentPos = 0

const inputActions = {
  send() {

    /** @type {function(Msg):void} */
    const pushMessage = $.pushMessage

    if (!engine.joined) {
      pushMessage({ nick: '*', text: "Attempting to reconnect. . ." })
      join(myChannel)
    }

    // Submit message
    if (input.value != '') {
      const text = input.value
      input.value = ''

      engine.send({ cmd: "chat", text })

      lastSent[0] = text
      lastSent.unshift("")
      lastSentPos = 0

      updateInputSize()
    }
  },

  up() {
    if (lastSentPos === 0) {
      lastSent[0] = input.value
    }

    lastSentPos += 1
    input.value = lastSent[lastSentPos]
    input.selectionStart = input.selectionEnd = input.value.length

    updateInputSize()
  },

  down() {
    lastSentPos -= 1
    input.value = lastSent[lastSentPos]
    input.selectionStart = input.selectionEnd = 0

    updateInputSize()
  },

  tab() {
    const pos = input.selectionStart || 0
    const text = input.value
    const index = text.lastIndexOf('@', pos)

    let autocompletedNick = false

    if (index >= 1 && index === pos - 1 && text.slice(index - 1, pos).match(/^@@$/)) {
      autocompletedNick = true
      backspaceAtCursor(1)
      insertAtCursor(onlineUsers.join(' @') + ' ')
    } else if (index >= 0 && index === pos - 1) {
      autocompletedNick = true
      if (lastMentioned.length > 0) {
        insertAtCursor(lastMentioned + ' ')
      } else {
        insertAtCursor(myNick.split('#')[0] + ' ')
        lastMentioned = myNick.split('#')[0]
      }
    } else if (index >= 0) {
      const stub = text.substring(index + 1, pos)

      // Search for nick beginning with stub
      let nicks = onlineUsers.filter(nick => nick.indexOf(stub) === 0)

      if (nicks.length === 0) {
        nicks = onlineUsers.filter(
          nick => nick.toLowerCase().indexOf(stub.toLowerCase()) === 0
        )
      }

      if (nicks.length > 0) {
        autocompletedNick = true
        if (nicks.length === 1) {
          backspaceAtCursor(stub.length)
          insertAtCursor(nicks[0] + ' ')
          lastMentioned = nicks[0]
        }
      }
    }

    // Since we did not insert a nick, we insert a tab character
    if (!autocompletedNick) {
      insertAtCursor('\t')
    }
  },
}

/**
 * @param {KeyboardEvent} e
 */
const inputActionsHandler = (e) => {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault()

    inputActions.send()
  } else if (e.key === "ArrowUp") {
    // Restore previous sent messages
    if (input.selectionStart === 0 && lastSentPos < lastSent.length - 1) {
      e.preventDefault()

      inputActions.up()
    }
  } else if (e.key === "ArrowDown") {
    if (input.selectionStart === input.value.length && lastSentPos > 0) {
      e.preventDefault()

      inputActions.down()
    }
  } else if (e.key === "Escape") {
    e.preventDefault()

    // Clear input field
    input.value = ""
    lastSentPos = 0
    lastSent[lastSentPos] = ""

    updateInputSize()
  } else if (e.key === "Tab") {
    // Tab complete nicknames starting with @

    if (e.ctrlKey) {
      // Skip autocompletion and tab insertion if user is pressing ctrl
      // ctrl-tab is used by browsers to cycle through tabs
      return
    }
    e.preventDefault()

    inputActions.tab()
  }
}

export { render, displayMessage, inputActionsHandler }
