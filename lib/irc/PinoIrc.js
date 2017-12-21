'use strict'

const cluster = require('cluster')
const irc = require('irc')

const IrcMessage = require('./IrcMessage')

const config = require('../../config')
const GroupToChannelMap = require('./GroupToChannelMap')

class PinoIrc {
  constructor (api) {
    if (!cluster.isMaster) {
      return
    }

    this._ready = false
    this._api = api
    this._groupsChannel = GroupToChannelMap.instance


    this.initClient()

    for (let el of this._groupsChannel.chatIds) {
      this._ircClient.on(
        `message${el[0]}`,
        this.sendMessageToTelegram.bind(this, el[1], el[0]))
    }

    for (let id in cluster.workers) {
      cluster.workers[id].on('message', this.handleProcessMsg.bind(this))
    }
  }

  initClient() {
    this._ircClient =  new irc.Client(config.pinoIrc.server, 'PinoOneeChan', {
     channels: [...this._groupsChannel.chatIds.keys()],
     stripColors: true,
     userName: 'pino',
     realName: 'Your Onee-chan',
    })

    this._ircClient.on('registered', (message) => {
      this._ready = true;
    })
  }

  sendMessageToTelegram(chatIds, to, from, message) {
    for (let chatId of chatIds) {
      this._api.sendMessage(chatId, `[IRC${to}] ${from}: ${message}`)
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

  static say (chatId, message) {
    for (let channel of GroupToChannelMap.instance.channels.get(chatId)) {
      process.send(
        this.serializeMessage(new IrcMessage('say', channel, message))
      )
    }
  }
}

module.exports = PinoIrc
