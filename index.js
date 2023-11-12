import { isAtBottom } from "./utils"
import { updateTitle } from "./ui_utils"

window.addEventListener("scroll", () => {
  if (isAtBottom()) {
    updateTitle()
  }
})