import { updateInputSize } from "./ui-utils.js"

let lastSent = [""]
let lastSentPos = 0

const inputActions = {
  send() {

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
      insertAtCursor($onlineUsers.join(' @') + ' ')
    } else if (index >= 0 && index === pos - 1) {
      autocompletedNick = true
      if (lastMentioned.length > 0) {
        insertAtCursor(lastMentioned + ' ')
      } else {
        insertAtCursor(myNickName() + ' ')
        lastMentioned = myNickName()
      }
    } else if (index >= 0) {
      const stub = text.substring(index + 1, pos)

      // Search for nick beginning with stub
      let nicks = $onlineUsers.filter(nick => nick.indexOf(stub) === 0)

      if (nicks.length === 0) {
        nicks = $onlineUsers.filter(
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
  if (e.key === "Enter" && !e.shiftKey) {
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

export { inputActions, inputActionsHandler }