/**
 * Entry of NeoHC++, sets up UI.
 */

import { updateInputSize, updateTitle } from "./ui_utils.js"
import { inputActionsHandler } from "./input.js"
import { frontPage } from "./frontpage.js"
import $ref from "./ref.ts"

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

    $onlineUsers = new $ref([])
    await engine.join(myChannel, myNick)
  }
} else {
  footer.classList.add('hidden')
  pushMessage({ text: frontPage() }, { renderMode: "allowHTML" })
}
