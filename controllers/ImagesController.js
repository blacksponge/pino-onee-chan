'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const InputFile = Telegram.InputFile

class ImagesController extends TelegramBaseController {
  flipTableHandler ($) {
    $.sendDocument(InputFile.byFilePath('imgs/flip_table.gif'))
  }

  get routes() {
    return {
      'flipTableCommand': 'flipTableHandler'
    }
  }
}

module.exports = ImagesController
