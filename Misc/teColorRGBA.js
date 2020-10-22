class teColorRGBA {
  /** @type {number} */ R = null
  /** @type {number} */ G = null
  /** @type {number} */ B = null
  /** @type {number} */ A = null

  /**
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @param {number} alpha
   */
  constructor(red, green, blue, alpha) {
    this.R = red
    this.G = green
    this.B = blue
    this.A = alpha
  }

  /**
   * @returns {string}
   */
  ToHex() {
    return `#${this._ToHex(this.R)}${this._ToHex(this.G)}${this._ToHex(this.B)}`
  }

  /**
   * @returns {string}
   */
  ToRGBA() {
    return `${this._ToRGB(this.R)} ${this._ToRGB(this.G)} ${this._ToRGB(this.B)} ${this._ToRGB(this.A)}`
  }

  /**
   * @param {number} gamma
   * @returns {teColorRGBA}
   */
  ToNonLinear(gamma = 2.2) {
    return new teColorRGBA(Math.pow(this.R, 1 / gamma), Math.pow(this.G, 1 / gamma), Math.pow(this.B, 1 / gamma), this.A)
  }

    /**
   * @param {number} gamma
   * @returns {teColorRGBA}
   */
  ToLinear(gamma = 2.2) {
    return new teColorRGBA(Math.pow(this.R, gamma), Math.pow(this.G, gamma), Math.pow(this.B, gamma), this.A)
  }

  /**
   * @param {number} value
   * @returns {string}
   */
  _ToHex(value) {
    return this._ToRGB(value).toString(16).padStart(2, '0').toUpperCase()
  }

  /**
   * @param {number} value
   * @returns {number}
   */
  _ToRGB(value) {
    return Math.round(value * 255)
  }
}
