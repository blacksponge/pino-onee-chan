'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

const http = require('http')

class CogitoController extends TelegramBaseController {

  questionHandler ($) {
    if ($.pinoMessageInfo.toMe) {
      this.answerQuestion($)
    } else {
      this.logQuestion($)
    }
  }

  answerQuestion ($) {
    let finalMessage = $.message.chat.type === 'group'
    ? `@${$.message.from.username} `
    : ''
    let qw = $.pinoMessageInfo.questionWord
    if (qw.word && qw.word !== 'est ce') {
      finalMessage += `je sais pas \n[debug]: ${JSON.stringify($.pinoMessageInfo)}`
    } else {
      finalMessage += 'oui !'
    }
    $.sendMessage(finalMessage)
  }

  logQuestion ($) {
    console.log($.message.text)
  }

  get routes () {
    return {
      'questionCommand': 'questionHandler'
    }
  }
}

module.exports = CogitoController;
