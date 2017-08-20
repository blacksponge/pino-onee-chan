'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

const http = require('http')

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


    let req = http.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`, (res) => {
      const { statusCode } = res
      if (statusCode != 200) {
        $.sendMessage(`The remote server is rude, answered me with ${statusCode} code`)
        res.resume()
        return
      }

      res.setEncoding('utf-8')
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData)
          this.sendDefinition($, parsedData, page)
        } catch (e) {
          $.sendMessage('Those data are too difficult to understand. Giving up..')
        }
      })
    })
  }

  sendDefinition ($, jsonDef, page) {
    let finalMessage = ''

    if (jsonDef.result_type === 'exact') {
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
      finalMessage = jsonDef.result_type
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
