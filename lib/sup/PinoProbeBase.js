'use strict'

class PinoProbeBase {
  constructor () {
    this._states = {}
    this._callback = null
  }

  getState (id) {
    return this._state[id] || null
  }

  updateState (id, state) {
    let oldState  = this._states[id] || null

    if (oldState === null || oldState.success != state.success) {
      this._call(id, state)
    }
    this._states[id] = state
  }

  attach (callback) {
    this._callback = callback
  }

  _call (id, state) {
    if (this._callback !== null) {
      let status = state.success ? '\u2705 ' : '\u203C '
      this._callback(`${status} ${id} ${state.msg}`)
    }
  }

  start () {
    throw 'Not implemented'
  }
}

module.exports = PinoProbeBase;
