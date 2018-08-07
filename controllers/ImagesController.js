'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const InputFile = Telegram.InputFile

const { getJSON } = require('../utils/common')

class ImagesController extends TelegramBaseController {
  flipTableHandler ($) {
    $.sendDocument(InputFile.byFilePath('imgs/flip_table.gif'))
  }

  thisIsFineHandler ($) {
    let imgs = ['daijoubu', 'this_is_fine']
    let img = imgs[Math.floor(Math.random()*imgs.length)]
    $.sendPhoto(InputFile.byFilePath(`imgs/${img}.jpg`))
  }

  bugerMaisonHandler ($) {
    let imgs = ['burger1.jpg', 'burger2.png']
    let img = imgs[Math.floor(Math.random()*imgs.length)]
    $.sendPhoto(InputFile.byFilePath(`imgs/${img}`))
  }

  danbooruHandler ($) {
    let tag = $.message.text
      .split(' ')
      .filter(el => {return el.length})
      .slice(1)
      .join(' ')
    let url = 'https://danbooru.donmai.us/posts.json'
    if (tag) {
      url += `?random=true&limit=1&tags=${encodeURIComponent(tag)}`
    }
    getJSON(url, $, (parsedData) => {
      if (parsedData.length > 0) {
        let options = {caption: `Source https://danbooru.donmai.us/posts/${parsedData[0].id}`}

        let input = InputFile.byUrl(
          parsedData[0].file_url,
          parsedData[0].file_url
        )

        if (parsedData[0].file_ext == 'gif') {
          $.sendDocument(input, options)
        } else {
          console.log(input)
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
      'danbooruCommand': 'danbooruHandler',
      'thisIsFineCommand': 'thisIsFineHandler',
      'burgerMaisonCommand': 'bugerMaisonHandler'
    }
  }
}

module.exports = ImagesController
