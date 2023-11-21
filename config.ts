import $ref from "./ref.js"
import { html } from "sinuous"
import { map } from "sinuous/map"

let $configs = new $ref([] as Config<unknown>[])

interface Config<T> {
  name: string
  value: T
  type: string

  onChange?(_: T): void

  toHTML(): HTMLElement | DocumentFragment
}

class CheckboxConfig implements Config<boolean> {
  name: string
  value: boolean
  type = 'checkbox'

  onChange?: (_: boolean) => void

  constructor(name: string, default_value: boolean, onChange?: (_: boolean) => void) {
    this.name = name
    this.value = default_value ?? false
    this.onChange = onChange
  }

  toHTML() {
    let input = html`<input type="checkbox" onchange=${this.onChange}>`
    return html`
      <p><label>${input}${this.name}</label></p>
    `
  }
}

class SelectConfig implements Config<string> {
  name: string
  value: string
  type = 'select'

  options: string[]

  onChange?: (_: string) => void

  constructor(name: string, options: string[], default_value: string, onChange?: (_: string) => void) {
    this.name = name
    this.options = options
    this.value = default_value
    this.onChange = onChange
  }

  toHTML() {
    return html`
      <h4>${this.name}</h4>
      <select name=${this.name}>
      ${map(
        () => this.options,
        (option: string) => html`<option value=${option}>${option}</option>`
      )}
      </select>
    `
  }
}

class ConfigGroup {
  configs: Config<unknown>[]

  toHTML() {
    return map(
      () => this.configs,
      (config: Config<unknown>) => config.toHTML()
    )
  }
}
