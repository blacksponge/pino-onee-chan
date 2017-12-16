'use strict'

const cluster = require('cluster')
const irc = require('irc')

const IrcMessage = require('./IrcMessage')

const config = require('../../config')

class PinoIrc {
  constructor () {
    if (!cluster.isMaster) {
      return
    }

    console.log('master')
    this._ircClient =  new irc.Client(config.pinoIrc.server, 'PinoOneeChan', {
     channels: config.pinoIrc.channels,
     stripColors: true,
     userName: 'pino',
     realName: 'Your Onee-chan',
    })
    this._ready = false

    this._ircClient.on('registered', (message) => {
      this._ready = true;
    })

    for (let id in cluster.workers) {
      cluster.workers[id].on('message', this.handleProcessMsg.bind(this))
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
    for (let i in config.pinoIrc.channels) {
      process.send(
        this.serializeMessage(new IrcMessage('say', config.pinoIrc.channels[i], message))
      )
    }
  }
}

module.exports = PinoIrc
