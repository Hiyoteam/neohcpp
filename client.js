import { Commands, Engine, Events } from "./engine"
import { input } from "./html"
import { displayMessage, inputActionsHandler, render } from "./ui"
import { html, updateInputSize } from "./ui_utils"

myChannel = location.search.replace("?", "")

engine = new Engine("wss://hack.chat/chat-ws")

/**
 * @param {Msg} args
 */
const pushMessage = (args) => {
  displayMessage(args)
}

engine.on(Commands.chat, (args) => {
  pushMessage(args)
})

engine.on(Commands.info, (args) => {
  pushMessage({ ...args, 'nick': '*' })
})

engine.on(Commands.emote, (args) => {
  pushMessage({ ...args, 'nick': '*' })
})

engine.on(Commands.warn, (args) => {
  pushMessage({ ...args, 'nick': '!' })
})

engine.on(Commands.onlineSet, (args) => {
  const nicksHTML = args.nicks.map((nick) => {
    if (nick.match(/^_+$/)) {
      return nick // such nicknames made up of only underlines will be rendered into a horizontal rule. 
    }
    const div = document.createElement('div')
    div.innerHTML = render(nick)
    return div.firstChild.innerHTML
  })

  pushMessage({ nick: '*', [html]: "Users online: " + nicksHTML.join(", ") })
})

engine.on(Commands.chat, (args) => {
  pushMessage(args)
})

engine.on(Commands.chat, (args) => {
  pushMessage(args)
})

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
