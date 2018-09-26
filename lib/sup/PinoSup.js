'use strict'

const net = require('net')
const config = require('../../config')

class PinoSup {
  constructor (api) {
    this._api = api
    this._channels = config.pinoSup.chatIds
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
    if (message.startsWith('PROBLEM')) {
      prefix = '\ud83d\udca5' // explosion
    } else if (message.startsWith('RECOVERY')) {
      prefix = '\ud83d\udc19' // poulpe
    } else {
      prefix = '\ud83e\udd20' // sherif
    }

    for (let channel of this._channels) {
      this._api.sendMessage(channel, `${prefix} ${message}`, {
        parse_mode: 'Markdown'
      })
    }
  }
}

module.exports = PinoSup;
