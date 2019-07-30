'use strict'

const net = require('net')
const config = require('../../config')

class PinoSup {
  constructor (api, pinoIrc) {
    this._api = api
    this._irc = pinoIrc._ircClient
    this._channels = config.pinoSup.chatIds
    this._ircChan = config.pinoSup.ircChan
    this._server = net.createServer()
    this._server.on('connection', this.newSocket.bind(this))
    this._server.listen(config.pinoSup.port)
    this._remotes = config.pinoSup.remotes
  }

  newSocket (socket) {
    if (!this.isAuthorized(socket)) {
      socket.destroy()
      return
    }

    let msg = ''
    socket.setEncoding('utf8')
    socket.on('data', (data) => {
      msg += data
    })
    socket.on('close', (hadError) => {
      console.log(`SUP: ${msg}`)
      this.sendUpdate(msg)
    })
  }

  isAuthorized(socket) {
    let remoteIP = socket.remoteAddress

    // from https://stackoverflow.com/a/35560645
    let mappedIpv4Regex = /^:(:ffff)?:(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/

    if (mappedIpv4Regex.test(remoteIP))
      remoteIP = remoteIP.replace(/^.*:/, '')

    return this._remotes.indexOf(remoteIP) >= 0
  }

  sendUpdate (message) {
    let prefix = ''
    let state = message.split(' ')[0];
    if (['DOWN', 'CRITICAL'].indexOf(state) >= 0) {
      prefix = '⛑️' // casque de pompier
    } else if (['UP', 'OK'].indexOf(state) >= 0) {
      prefix = '🥬' // salade verte
    } else {
      prefix = '\ud83e\udd20' // sherif
    }

    let finalMessage = `${prefix} ${message}`

    for (let channel of this._channels) {
      this._api.sendMessage(channel, finalMessage)
    }
    for (let channel of this._ircChan) {
      this._irc.say(channel, finalMessage)
    }
  }
}

module.exports = PinoSup;
