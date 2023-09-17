import { Engine, Events } from "./engine"
import { input } from "./html"
import { displayMessage, inputActionsHandler } from "./ui"
import { updateInputSize } from "./uiutils"
import { $def } from "./v"

const myChannel = location.search.replace("?", "")

$def("myChannel", () => myChannel)

const engine = new Engine("wss://hack.chat/chat-ws")

$def("engine", () => engine)

/** @type {string?} */
let myNick

$def("myNick", () => myNick)

/** @type {string[]} */
let onlineUsers = []

$def("onlineUsers", () => onlineUsers)

const pushMessage = (args) => {
  displayMessage(args)
}

$def("pushMessage", () => pushMessage)

engine.on(Events.message, pushMessage)

input.addEventListener("input", updateInputSize)

input.addEventListener("keydown", inputActionsHandler)

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
