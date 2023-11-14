import { Engine, Events } from "../engine.js"

const $id = document.getElementById.bind(document)

const channel = location.search.replace("?", "")

/** @type {HTMLDivElement} */
const messages_el = $id("messages")

/** @type {HTMLTextAreaElement} */
const chatinput_el = $id("chatinput")

/** @type {HTMLElement} */
const footer = $id("footer")

const isAtBottom = () => {
  return (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 1)
}

const updateInputSize = () => {
  const atBottom = isAtBottom()

  chatinput_el.style.height = 0
  chatinput_el.style.height = chatinput_el.scrollHeight + 'px'
  document.body.style.marginBottom = footer.offsetHeight + 'px'

  if (atBottom) {
    window.scrollTo(0, document.body.scrollHeight)
  }
}

updateInputSize()

chatinput_el.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    const text = chatinput_el.value
    chatinput_el.value = ""
    engine.send({ cmd: "chat", text })
  }
})

chatinput_el.addEventListener("input", () => updateInputSize())

const engine = new Engine("wss://hack.chat/chat-ws")

engine.on(Events.rawMessage, (data) => {
  const atBottom = isAtBottom()

  const div_el = document.createElement("div")
  const pre_el = document.createElement("pre")
  const code_el = document.createElement("code")
  code_el.textContent = data
  pre_el.appendChild(code_el)
  div_el.appendChild(pre_el)
  messages_el.appendChild(div_el)

  if (atBottom) {
    window.scrollTo(0, document.body.scrollHeight)
  }
})

await engine.connect()

const nick = prompt("nick:")

if (!nick) {
  engine.close()
} else {
  await engine.join(channel, nick)
}
