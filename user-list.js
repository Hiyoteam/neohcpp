import { html, o } from "sinuous"
import { map } from "sinuous/map"
import { Commands } from "./engine.js"

engine.once(Commands.onlineSet, () => {

  /** @type {import('sinuous/src/observable').Observable<User[]>} */
  let onlineUsersO = o($onlineUsers.$)

  $onlineUsers.setter = () => onlineUsersO($onlineUsers.$)

  usersEl.appendChild(html`
    ${map(
      onlineUsersO,
      (/**@type {User}*/user) => html`
        <li>
          <a title=${user.hash}>${user.nick}</a>
          ${
            user.trip &&
            html`<span class="trip"> ${user.trip}</span>`
          }
        </li>`
    )}
  `, )

})
