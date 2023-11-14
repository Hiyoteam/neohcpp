import { html, o } from 'sinuous'
import { map } from 'sinuous/map'
import { Commands } from './engine'

engine.once(Commands.onlineSet, () => {

  /** @type {import('sinuous/src/observable').Observable<User[]>} */
  let onlineUsersO = o($onlineUsers.$)

  $onlineUsers.setter = () => onlineUsersO($onlineUsers.$)

  $id('users-wrap').appendChild(html`
    <ul>
      ${map(
        onlineUsersO,
        (/**@type {User}*/user) => html`<li><a>${user.nick}</a>${
          user.trip ? html`<span class="trip"> ${user.trip}</span>` : ''
        }</li>`
      )}
    </ul>
  `)

})
