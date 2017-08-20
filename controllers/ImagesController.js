'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const InputFile = Telegram.InputFile

const { getJSON } = require('../utils/common')

class ImagesController extends TelegramBaseController {
  flipTableHandler ($) {
    $.sendDocument(InputFile.byFilePath('imgs/flip_table.gif'))
  }

  danbooruHandler ($) {
    getJSON(`http://danbooru.donmai.us/posts/random.json`, $, (parsedData) => {
      $.sendPhoto(InputFile.byUrl(`http://danbooru.donmai.us${parsedData.file_url}`, `img.${parsedData.file_ext}`),)
    })
  }

  get routes() {
    return {
      'flipTableCommand': 'flipTableHandler',
      'danbooruCommand': 'danbooruHandler'
    }
  }
}

module.exports = ImagesController
