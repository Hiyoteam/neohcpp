const channels = [
  ['?your-channel', '?programming', '?lounge'],
  ['?meta', '?math', '?physics', '?chemistry'],
  ['?technology', '?games', '?banana'],
  ['?test', '?your-channell', '?china', '?chinese', '?kt1j8rpc'],
]

const frontPage = () => {
  return [
    "<pre><code class=\"hljs\"><div style=\"margin: auto; width: fit-content;\">" +
    " _           _         _       _   ",
    "| |_ ___ ___| |_   ___| |_ ___| |_ ",
    "|   |_ ||  _| '_| |  _|   |_ ||  _|",
    "|_|_|__/|___|_,_|.|___|_|_|__/|_|  ",
    "</div></code></pre>",
    "",
    "---",
    "Welcome to hack.chat, a minimal, distraction-free chat application.",
    "This is NeoHC++ client. For official hack.chat client, visit: https://hack.chat.",
    "Channels are created, joined and shared with the url, create your own channel by changing the text after the question mark. Example: " + (location.host != '' ? ('https://' + location.host + '/') : window.location.href) + "?your-channel",
    "There are no channel lists *for normal users*, so a secret channel name can be used for private discussions.",
    "---",
    "Here are some pre-made channels you can join: ",
    channels.map(line => line.join(' ')).join('\n'),
    "And here's a random one generated just for you: " + ("?" + Math.random().toString(36).substring(2, 8)),
    "---",
    "Formatting:",
    "Notice: Don't send raw source code without using a code block!",
    "Surround LaTeX with a dollar sign for inline style $\\zeta(2) = \\pi^2/6$, and two dollars for display. ",
    "For syntax highlight, wrap source code like: \\`\\`\\`\\<language\\> \\<new line\\> \\<the code\\> \\<new line\\>\\`\\`\\`.",
    "---",
    "Current Github: https://github.com/hack-chat",
    "Legacy GitHub: https://github.com/AndrewBelt/hack.chat",
    "---",
    "Bots, Android clients, desktop clients, browser extensions, docker images, programming libraries, server modules and more:",
    "https://github.com/hack-chat/3rd-party-software-list",
    "---",
    "Server and web client released under the WTFPL and MIT open source license.",
    "No message history is retained on the hack.chat server, but in certain channels there may be bots made by users which record messages.",
    "---",
    "Github of NeoHCPP: https://github.com/hiyoteam/neohcpp",
  ].join("\n")
}

export { frontPage }
