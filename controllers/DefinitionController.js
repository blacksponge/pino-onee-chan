'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

const { getJSON } = require('../utils/common')

class DefinitionController extends TelegramBaseController {

  defineHandler ($) {
    let args = $.message.text
      .split(' ')
      .filter(el => {return el.length})
      .slice(1)
    let page = 1
    let term = ''
    if (args[0] === '-p' && !isNaN(args[1])) {
      page = parseInt(args[1])
      term = args.slice(2).join(' ')
    } else {
      term = args.join(' ')
    }

    let url = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`
    getJSON(url, $, this.sendDefinition.bind(null, page, $))

  }

  sendDefinition (page, $, jsonDef) {
    let finalMessage = ''

    if (jsonDef.list.length > 0) {
      let def = jsonDef.list[page-1]
      if (def) {
        let nbDefs = jsonDef.list.length
        finalMessage = `<b>${def.word}</b> (${page}/${nbDefs})\n\n`
        finalMessage += `${def.definition}\n\n`
        finalMessage += `<i>${def.example}</i>\n\n`
        finalMessage += `${def.permalink}`
      } else {
        finalMessage = 'Are you dumb? That page doesn\'t exist.'
      }
    } else {
      finalMessage = 'no result'
    }

    $.sendMessage(finalMessage, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
  }

  get routes () {
    return {
      'defineCommand': 'defineHandler'
    }
  }
}

module.exports = DefinitionController;
