'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

const PinoIrc = require('../lib/irc/PinoIrc')

class TelegramToIrcController extends TelegramBaseController {

  constructor () {
    super()
  }

  messageHandler ($) {
    let pseudo = $.message.from.username
    ? $.message.from.username
    : $.message.from.firstName + ' ' + $.message.from.lastName

    PinoIrc.say($.message.chat.id, `[Telegram] ${pseudo}:\n${$.message.text.slice(1)}`)
  }

  get routes () {
    return {
      'proxyTelegramToIrcCommand': 'messageHandler'
    }
  }
}

module.exports = TelegramToIrcController
