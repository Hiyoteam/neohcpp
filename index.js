import { isAtBottom } from "./utils"
import { updateTitle } from "./ui_utils"
import { inputActionsHandler } from "./input"
import { input } from "./html"

myChannel = location.search.replace("?", "")

window.addEventListener("scroll", () => {
  if (isAtBottom()) {
    updateTitle()
  }
})

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
