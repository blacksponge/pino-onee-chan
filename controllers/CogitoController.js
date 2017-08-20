'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

const http = require('http')

class CogitoController extends TelegramBaseController {

  questionHandler ($) {
    let finalMessage = $.message.chat.type === 'group'
      ? `@${$.message.from.username}`
      : ''
    finalMessage += 'oui !'
    $.sendMessage(finalMessage)
  }

  get routes () {
    return {
      'questionCommand': 'questionHandler'
    }
  }
}

module.exports = CogitoController;
