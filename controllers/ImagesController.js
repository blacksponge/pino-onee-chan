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
    let tag = $.message.text
      .split(' ')
      .filter(el => {return el.length})
      .slice(1)
      .join(' ')
    let url = 'http://danbooru.donmai.us/posts/random.json'
    if (tag) {
      url += `?tags=${encodeURIComponent(tag)}`
    }
    getJSON(url, $, (parsedData) => {
      if (parsedData.file_url) {
        let options = {caption: `Source http://danbooru.donmai.us/posts/${parsedData.id}`}

        let input = InputFile.byUrl(
          `http://danbooru.donmai.us${parsedData.file_url}`,
          parsedData.file_url
        )

        if (parsedData.file_ext == 'gif') {
          $.sendDocument(input, options)
        } else {
          $.sendPhoto(input, options)
        }

      } else {
        $.sendMessage('Try again')
      }
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
