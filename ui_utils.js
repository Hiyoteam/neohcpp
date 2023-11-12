import { input, footer } from "./html"
import { isAtBottom, scrollToBottom } from "./utils"

const updateInputSize = () => {
  const wasAtBottom = isAtBottom()

  input.style.height = 0
  input.style.height = input.scrollHeight + 'px'
  document.body.style.marginBottom = footer.offsetHeight + 'px'

  if (wasAtBottom) {
    scrollToBottom()
  }
}

/**
 * @param {string} text
 */
const insertAtCursor = (text) => {
  const start = input.selectionStart || 0
  const before = input.value.slice(0, start)
  const after = input.value.slice(start)

  const newbefore = before + text
  input.value = newbefore + after
  input.selectionStart = input.selectionEnd = newbefore.length

  updateInputSize()
}

const backspaceAtCursor = (length = 0) => {
  const start = input.selectionStart || 0
  const before = input.value.slice(0, start)
  const after = input.value.slice(start)

  const newbefore = before.slice(0, -length)
  input.value = newbefore + after
  input.selectionStart = input.selectionEnd = newbefore.length

  updateInputSize()
}

const updateTitle = () => {
  const isFrontPage = myChannel === ''

  if (isFrontPage || (document.hasFocus() && isAtBottom())) {
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

export { updateInputSize, insertAtCursor, backspaceAtCursor, updateTitle }
