'use strict'

const Telegram = require('telegram-node-bot')
const BaseCommand = Telegram.BaseCommand

class PinoCommandFilter extends BaseCommand {
  constructor (prefix, commandName, handler) {
    super()
    this._prefix = prefix.constructor === Array ? prefix : [prefix]
    this._commandName = commandName
    this._handler = handler
  }

  test ($) {
    return $.message.text &&
      this._prefix.indexOf($.message.text[0]) > -1 &&
      $.message.text.slice(1).split(' ')[0] === this._commandName
  }

  get handlerName () {
    return this._handler
  }
}

module.exports = PinoCommandFilter
