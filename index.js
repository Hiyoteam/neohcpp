/**
 * Entry of NeoHC++, sets up UI.
 */

import { updateInputSize, updateTitle } from "./ui_utils"
import { inputActionsHandler } from "./input"
import { pushMessage } from "./client"

myChannel = location.search.replace("?", "")

window.addEventListener("scroll", () => {
  if (isAtBottom()) {
    updateTitle()
  }
})

updateInputSize()

input.addEventListener('input', updateInputSize)

input.addEventListener('keydown', inputActionsHandler)

if (myChannel) {
  await engine.connect()

  myNick = prompt("Nickname:")

  if (!myNick) {
    engine.close()
  } else {
    await engine.join(myChannel, myNick)
  }
} else {
  pushMessage({ text: "Temporary Frontpage" })
}
