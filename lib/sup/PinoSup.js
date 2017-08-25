'use strict'

const config = require('../../config')

class PinoSup {
  constructor (api, probers = []) {
    this._api = api
    this._probers = probers
    this._channels = config.pinoSup.chatIds

    this._probers.map(this.register.bind(this))
  }

  register (prober) {
    prober.attach(this.sendUpdate.bind(this))
    prober.start()
  }

  sendUpdate (message) {
    for (let channel of this._channels) {
      this._api.sendMessage(channel, message)
    }
  }
}

module.exports = PinoSup;
