'use strict'

class IrcMessage {
  constructor (method, ...arg) {
    this._method = method
    this._arguments = arg
  }

  serialize () {
    return {
      method: this._method,
      arguments: this._arguments
    }
  }

  static deserialize (payload) {
    return new IrcMessage(payload.method, ...payload.arguments)
  }

  get method () {
    return this._method
  }

  get arguments () {
    return this._arguments
  }
}

module.exports = IrcMessage
