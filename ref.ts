class $ref<T> {
  private _val: T

  getter?: () => T

  setter?: (_: T) => void

  constructor(val: T, getter?: () => T, setter?: (_: T) => void) {
    this._val = val

    this.getter = getter

    this.setter = setter
  }

  get $ () {
    if (this.getter) {
      this._val = this.getter() ?? this._val
    }
    return this._val
  }

  set $ (val) {
    this._val = val
    if (this.setter) {
      this.setter(this._val)
    }
  }
}

export { $ref }

export default $ref
