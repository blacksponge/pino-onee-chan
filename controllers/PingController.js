'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const child_process = require('child_process')

class PingController extends TelegramBaseController {
  pingHandler ($) {
    let domain = $.message.text.split(' ')[1]
    if (!domain) {
      $.sendMessage(`@${$.message.from.username} Missing target :/`)
    } else {
      $.sendMessage(`@${$.message.from.username} Pinging ${domain}...`)

      let ping = child_process.spawn('ping', ['-W', '1', '-c', '4', '-O', domain])
      let bufferedOutput = []

      ping.stdout.on('data', (data) => {
        bufferedOutput.push(data)
      })

      ping.on('close', (code) => {
        $.sendMessage(`@${$.message.from.username} Ping result for ${domain}:\n${bufferedOutput.join('\n')}`)
      })
    }
  }

  get routes() {
    return {
      'pingCommand': 'pingHandler'
    }
  }
}

module.exports = PingController
