/**
 * Entry of NeoHC++, sets up UI.
 */

import { updateInputSize, updateTitle } from "./ui_utils"
import { inputActionsHandler } from "./input"
import { pushMessage } from "./client"

myChannel = location.search.replace(/^\?/, "")

window.addEventListener("scroll", () => {
  if (isAtBottom()) {
    updateTitle()
  }
})

updateInputSize()

input.addEventListener('input', updateInputSize)

input.addEventListener('keydown', inputActionsHandler)

//https://github.com/hack-chat/main/pull/184
//select "chatinput" on "/"
document.addEventListener("keydown", (e) => {
  if (e.key === '/' && input != document.activeElement) {
    e.preventDefault()
    input.focus()
  }
})

if (myChannel) {
  await engine.connect()

  myNick = prompt("Nickname:", localStorageGet("myNick"))

  if (!myNick) {
    engine.close()
  } else {
    localStorageSet("myNick", myNick)
    await engine.join(myChannel, myNick)
  }
} else {
  pushMessage({ text: "Temporary Frontpage" })
}
