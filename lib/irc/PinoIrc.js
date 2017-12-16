'use strict'

const cluster = require('cluster')
const irc = require('irc')

const IrcMessage = require('./IrcMessage')

const config = require('../../config')

class PinoIrc {
  constructor (api) {
    if (!cluster.isMaster) {
      return
    }

    this._ready = false
    this._api = api

    this._ircClient =  new irc.Client(config.pinoIrc.server, 'PinoOneeChan', {
     channels: config.pinoIrc.channels,
     stripColors: true,
     userName: 'pino',
     realName: 'Your Onee-chan',
    })

    this._ircClient.on('registered', (message) => {
      this._ready = true;
    })

    this._ircClient.on('message', this.sendMessageToTelegram.bind(this))

    for (let id in cluster.workers) {
      cluster.workers[id].on('message', this.handleProcessMsg.bind(this))
    }
  }

  sendMessageToTelegram(from, to, message) {
    for (let group of config.pinoIrc.chatIds) {
      this._api.sendMessage(group, `[IRC${to}] ${from}: ${message}`)
    }
  }

  handleProcessMsg (msg) {
    if (msg.type !== 'irc' || !this._ready)
      return
    let ircMsg = IrcMessage.deserialize(msg.payload)

    this._ircClient[ircMsg.method](...ircMsg.arguments)
  }

  static serializeMessage (msg) {
    return {
      type: 'irc',
      payload: msg.serialize()
    }
  }

  static say (message) {
    for (let channel of config.pinoIrc.channels) {
      process.send(
        this.serializeMessage(new IrcMessage('say', channel, message))
      )
    }
  }
}

module.exports = PinoIrc
